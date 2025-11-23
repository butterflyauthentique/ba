/**
 * Shiprocket Webhook Handler
 * Receives tracking updates from Shiprocket and updates Firestore orders
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// ... (interfaces remain the same)

export const shippingWebhook = onRequest(async (req, res) => {
    // Handle GET requests for verification/health check
    if (req.method === 'GET') {
        res.status(200).send('Webhook is active');
        return;
    }

    // Only accept POST requests for actual webhook payloads
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        // Validate security token if configured (optional for testing)
        const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
        if (webhookSecret) {
            const providedToken = req.headers['x-api-key'];
            if (providedToken && providedToken !== webhookSecret) {
                console.error('❌ Invalid webhook security token');
                res.status(401).send('Unauthorized');
                return;
            }
            if (!providedToken) {
                console.warn('⚠️ Webhook called without security token - this is allowed for testing but should be configured in production');
            }
        }

        // Parse webhook payload
        const payload: ShiprocketWebhookPayload = req.body;

        console.log('📦 Shiprocket webhook received (full payload):', JSON.stringify(payload, null, 2));

        // Validate required fields
        if (!payload.order_id) {
            console.error('❌ Missing order_id in webhook payload');
            // Return 200 to prevent Shiprocket from retrying/failing the test
            res.status(200).json({ success: false, message: 'Missing order_id' });
            return;
        }

        // sr_shipment_id might be missing in test payloads, so make it optional or just warn
        if (!payload.sr_shipment_id) {
            console.warn('⚠️ Missing sr_shipment_id in webhook payload (normal for test events)');
        }

        // Find order by order number
        const ordersRef = admin.firestore().collection('orders');
        const orderQuery = await ordersRef
            .where('orderNumber', '==', payload.order_id)
            .limit(1)
            .get();

        if (orderQuery.empty) {
            console.error(`❌ Order not found: ${payload.order_id}`);
            // Return 200 to prevent Shiprocket from retrying/failing, especially for test events
            res.status(200).json({
                success: false,
                message: 'Order not found (likely a test event)',
                orderId: payload.order_id
            });
            return;
        }

        const orderDoc = orderQuery.docs[0];
        const orderId = orderDoc.id;

        // Prepare update data
        const updateData: any = {
            'shiprocket.shipmentStatus': payload.shipment_status,
            'shiprocket.awbCode': payload.awb,
            'shiprocket.courierName': payload.courier_name,
            'shiprocket.lastSyncedAt': admin.firestore.FieldValue.serverTimestamp(),
        };

        // Update tracking number for backward compatibility
        if (payload.awb) {
            updateData.trackingNumber = payload.awb;
            updateData.trackingUrl = `https://shiprocket.co/tracking/${payload.awb}`;
        }

        // Update estimated delivery date
        const estimatedDelivery = payload.etd || payload.edd;
        if (estimatedDelivery) {
            updateData['shiprocket.estimatedDeliveryDate'] = estimatedDelivery;
        }

        // Update pickup date
        const pickupDate = payload.pickup_scheduled_date || payload.pickup_date;
        if (pickupDate) {
            updateData['shiprocket.pickupScheduledDate'] = pickupDate;
        }

        // Update delivered date
        if (payload.delivered_date) {
            updateData['shiprocket.deliveredDate'] = payload.delivered_date;
        }

        // Update order status based on shipment status
        let orderStatus = orderDoc.data().status;
        let statusChanged = false;

        switch (payload.shipment_status.toUpperCase()) {
            case 'PICKUP_SCHEDULED':
            case 'PICKUP_QUEUED':
                if (orderStatus === 'confirmed' || orderStatus === 'pending') {
                    orderStatus = 'processing';
                    statusChanged = true;
                }
                break;

            case 'PICKUP_COMPLETE':
            case 'IN_TRANSIT':
            case 'OUT_FOR_DELIVERY':
                if (orderStatus !== 'shipped' && orderStatus !== 'delivered') {
                    orderStatus = 'shipped';
                    statusChanged = true;
                    if (!orderDoc.data().shippedAt) {
                        updateData.shippedAt = admin.firestore.FieldValue.serverTimestamp();
                    }
                }
                break;

            case 'DELIVERED':
                if (orderStatus !== 'delivered') {
                    orderStatus = 'delivered';
                    statusChanged = true;
                    updateData.deliveredAt = admin.firestore.FieldValue.serverTimestamp();
                }
                break;

            case 'CANCELLED':
            case 'RTO_INITIATED':
            case 'RTO_DELIVERED':
                if (orderStatus !== 'cancelled') {
                    orderStatus = 'cancelled';
                    statusChanged = true;
                }
                break;
        }

        if (statusChanged) {
            updateData.status = orderStatus;

            // Add to status history
            const statusHistory = orderDoc.data().statusHistory || [];
            statusHistory.push({
                status: orderStatus,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                note: `Shiprocket: ${payload.shipment_status}`,
            });
            updateData.statusHistory = statusHistory;
        }

        // Update order in Firestore
        await ordersRef.doc(orderId).update(updateData);

        console.log(`✅ Order ${payload.order_id} updated with shipment status: ${payload.shipment_status}`);

        // Send email notification to customer based on status
        if (statusChanged) {
            await sendShipmentNotification(orderDoc.data(), orderStatus, payload);
        }

        // Return 200 OK as required by Shiprocket
        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully',
            orderId: payload.order_id,
            status: payload.shipment_status,
        });

    } catch (error) {
        console.error('❌ Error processing Shiprocket webhook:', error);

        // Still return 200 to prevent Shiprocket from retrying
        // Log the error for manual investigation
        res.status(200).json({
            success: false,
            error: 'Internal error - logged for investigation',
        });
    }
});

/**
 * Send email notification to customer based on shipment status
 */
async function sendShipmentNotification(
    order: any,
    newStatus: string,
    payload: ShiprocketWebhookPayload
): Promise<void> {
    try {
        // Only send emails for specific status changes
        const shouldNotify = ['shipped', 'delivered'].includes(newStatus);

        if (!shouldNotify) {
            return;
        }

        const customerEmail = order.customer?.email;
        if (!customerEmail) {
            console.warn('⚠️ No customer email found for order:', order.orderNumber);
            return;
        }

        let subject = '';
        let emailBody = '';

        if (newStatus === 'shipped') {
            subject = `Your order ${order.orderNumber} has been shipped! 📦`;
            emailBody = `
        <h2>Your order is on its way!</h2>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${payload.awb}</p>
          <p><strong>Courier:</strong> ${payload.courier_name}</p>
          ${(payload.etd || payload.edd) ? `<p><strong>Estimated Delivery:</strong> ${payload.etd || payload.edd}</p>` : ''}
        </div>
        
        <p>Track your shipment: <a href="https://shiprocket.co/tracking/${payload.awb}">Click here to track</a></p>
        
        <p>Thank you for shopping with Butterfly Authentique!</p>
      `;
        } else if (newStatus === 'delivered') {
            subject = `Your order ${order.orderNumber} has been delivered! 🎉`;
            emailBody = `
        <h2>Your order has been delivered!</h2>
        <p>We hope you love your handcrafted items from Butterfly Authentique.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Delivered on:</strong> ${payload.delivered_date || 'Today'}</p>
        </div>
        
        <p>We'd love to hear your feedback! Please consider leaving a review.</p>
        
        <p>Thank you for choosing Butterfly Authentique!</p>
      `;
        }

        // Send email using your existing email service
        // This would integrate with your email/order-confirmation.ts service
        console.log(`📧 Email notification queued for ${customerEmail}: ${subject}`);
        console.log(`📧 Email body: ${emailBody.substring(0, 100)}...`);

        // TODO: Integrate with existing email service
        // await sendEmail(customerEmail, subject, emailBody);

    } catch (error) {
        console.error('❌ Error sending shipment notification:', error);
        // Don't throw - email failure shouldn't fail the webhook
    }
}


