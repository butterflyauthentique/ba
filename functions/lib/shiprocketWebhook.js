"use strict";
/**
 * Shiprocket Webhook Handler
 * Receives tracking updates from Shiprocket and updates Firestore orders
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiprocketWebhook = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
/**
 * Shiprocket Webhook Endpoint
 * POST /shiprocketWebhook
 *
 * Setup in Shiprocket Dashboard:
 * Settings → API → Webhooks → Add webhook URL
 */
exports.shiprocketWebhook = functions.https.onRequest(async (req, res) => {
    // Only accept POST requests
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        // Validate security token if configured
        const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
        if (webhookSecret) {
            const providedToken = req.headers['x-api-key'];
            if (providedToken !== webhookSecret) {
                console.error('❌ Invalid webhook security token');
                res.status(401).send('Unauthorized');
                return;
            }
        }
        // Parse webhook payload
        const payload = req.body;
        console.log('📦 Shiprocket webhook received:', {
            orderNumber: payload.order_id,
            awb: payload.awb,
            status: payload.current_status,
            shipmentStatus: payload.shipment_status,
        });
        // Validate required fields
        if (!payload.order_id || !payload.sr_shipment_id) {
            console.error('❌ Missing required fields in webhook payload');
            res.status(400).send('Bad Request: Missing required fields');
            return;
        }
        // Find order by order number
        const ordersRef = admin.firestore().collection('orders');
        const orderQuery = await ordersRef
            .where('orderNumber', '==', payload.order_id)
            .limit(1)
            .get();
        if (orderQuery.empty) {
            console.error(`❌ Order not found: ${payload.order_id}`);
            res.status(404).send('Order not found');
            return;
        }
        const orderDoc = orderQuery.docs[0];
        const orderId = orderDoc.id;
        // Prepare update data
        const updateData = {
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
        if (payload.edd) {
            updateData['shiprocket.estimatedDeliveryDate'] = payload.edd;
        }
        // Update pickup date
        if (payload.pickup_date) {
            updateData['shiprocket.pickupScheduledDate'] = payload.pickup_date;
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
    }
    catch (error) {
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
async function sendShipmentNotification(order, newStatus, payload) {
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
        let message = '';
        if (newStatus === 'shipped') {
            subject = `Your order ${order.orderNumber} has been shipped! 📦`;
            message = `
        <h2>Your order is on its way!</h2>
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Tracking Number:</strong> ${payload.awb}</p>
          <p><strong>Courier:</strong> ${payload.courier_name}</p>
          ${payload.edd ? `<p><strong>Estimated Delivery:</strong> ${payload.edd}</p>` : ''}
        </div>
        
        <p>Track your shipment: <a href="https://shiprocket.co/tracking/${payload.awb}">Click here to track</a></p>
        
        <p>Thank you for shopping with Butterfly Authentique!</p>
      `;
        }
        else if (newStatus === 'delivered') {
            subject = `Your order ${order.orderNumber} has been delivered! 🎉`;
            message = `
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
        // TODO: Integrate with existing email service
        // await sendEmail(customerEmail, subject, message);
    }
    catch (error) {
        console.error('❌ Error sending shipment notification:', error);
        // Don't throw - email failure shouldn't fail the webhook
    }
}
/**
 * Helper function to get user-friendly status message
 */
function getStatusLabel(status) {
    const statusMap = {
        'NEW': 'Order Created',
        'PICKUP_SCHEDULED': 'Pickup Scheduled',
        'PICKUP_QUEUED': 'Pickup Queued',
        'PICKUP_COMPLETE': 'Picked Up',
        'IN_TRANSIT': 'In Transit',
        'OUT_FOR_DELIVERY': 'Out for Delivery',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled',
        'RTO_INITIATED': 'Return Initiated',
        'RTO_DELIVERED': 'Returned to Seller',
        'LOST': 'Lost in Transit',
        'DAMAGED': 'Damaged',
    };
    return statusMap[status.toUpperCase()] || status;
}
//# sourceMappingURL=shiprocketWebhook.js.map