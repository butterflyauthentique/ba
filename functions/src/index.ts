import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
const Razorpay = require('razorpay');

import { createShiprocketOrder } from './shiprocket';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize CORS
const corsHandler = cors({ origin: true });

// Firestore database reference
const db = admin.firestore();
// Normalize helpers
const normalizeEmail = (email?: string) => (email || '').trim().toLowerCase();
const normalizePhone = (phone?: string) => (phone || '').replace(/\D/g, '');

// Upsert customer profile based on order data
const upsertCustomerProfile = async (customer: any, orderTotal: number) => {
  if (!customer) return null;
  const email = normalizeEmail(customer.email);
  const phone = normalizePhone(customer.phone);

  try {
    let customerId: string | null = null;

    if (email) {
      const snap = await db.collection('customers').where('primaryEmail', '==', email).limit(1).get();
      if (!snap.empty) {
        customerId = snap.docs[0].id;
      }
    }

    // Create new customer if none found
    if (!customerId) {
      const ref = await db.collection('customers').add({
        primaryEmail: email || null,
        emails: email ? [email] : [],
        phones: phone ? [phone] : [],
        name: customer.name || null,
        defaultAddress: customer.address || null,
        addresses: customer.address ? [customer.address] : [],
        totalOrders: 1,
        totalSpent: orderTotal || 0,
        firstOrderAt: admin.firestore.FieldValue.serverTimestamp(),
        lastOrderAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      customerId = ref.id;
    } else {
      // Update aggregates and addresses
      const ref = db.collection('customers').doc(customerId);
      await ref.set({
        name: customer.name || admin.firestore.FieldValue.delete(),
        defaultAddress: customer.address || admin.firestore.FieldValue.delete(),
        lastOrderAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        totalOrders: admin.firestore.FieldValue.increment(1),
        totalSpent: admin.firestore.FieldValue.increment(orderTotal || 0),
        emails: email ? admin.firestore.FieldValue.arrayUnion(email) : admin.firestore.FieldValue.delete(),
        phones: phone ? admin.firestore.FieldValue.arrayUnion(phone) : admin.firestore.FieldValue.delete(),
        addresses: customer.address ? admin.firestore.FieldValue.arrayUnion(customer.address) : admin.firestore.FieldValue.delete(),
      }, { merge: true });
    }

    return customerId;
  } catch (e) {
    console.error('Customer upsert failed:', e);
    return null;
  }
};

const DEFAULT_ADMIN_EMAIL = 'butterfly.auth@gmail.com';

// Admin authentication check: support UID or email doc IDs
const isAdmin = async (uid: string, email?: string): Promise<boolean> => {
  try {
    // Check by UID
    const byUid = await db.collection('admins').doc(uid).get();
    if (byUid.exists) return true;

    // Check by email (legacy schema where docId is email)
    if (email) {
      const byEmail = await db.collection('admins').doc(email).get();
      if (byEmail.exists) return true;
      if (email.toLowerCase() === DEFAULT_ADMIN_EMAIL) return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get all products (for admin panel)
export const getProducts = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const productsSnapshot = await db.collection('products').get();
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return res.json({ success: true, products });
    } catch (error) {
      console.error('Error getting products:', error);
      return res.status(500).json({ success: false, error: 'Failed to get products' });
    }
  });
});

// Get product by ID (for admin panel)
export const getProduct = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { id } = req.params;
      const productDoc = await db.collection('products').doc(id).get();

      if (!productDoc.exists) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const product = {
        id: productDoc.id,
        ...productDoc.data()
      };

      return res.json({ success: true, product });
    } catch (error) {
      console.error('Error getting product:', error);
      return res.status(500).json({ success: false, error: 'Failed to get product' });
    }
  });
});

// Create/Update product (for admin panel)
export const saveProduct = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { id, productData } = req.body;

      if (id) {
        // Update existing product
        await db.collection('products').doc(id).update({
          ...productData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        // Create new product
        const docRef = await db.collection('products').add({
          ...productData,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return res.json({ success: true, id: docRef.id });
      }

      return res.json({ success: true, id });
    } catch (error) {
      console.error('Error saving product:', error);
      return res.status(500).json({ success: false, error: 'Failed to save product' });
    }
  });
});

// Delete product (for admin panel)
export const deleteProduct = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Product ID is required' });
      }

      await db.collection('products').doc(id).delete();
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  });
});

// Get all orders (for admin panel)
export const getOrders = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const ordersSnapshot = await db.collection('orders').get();
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return res.json({ success: true, orders });
    } catch (error) {
      console.error('Error getting orders:', error);
      return res.status(500).json({ success: false, error: 'Failed to get orders' });
    }
  });
});

// Get admin statistics (for admin panel dashboard)
export const getAdminStats = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Get total products
      const productsSnapshot = await db.collection('products').get();
      const totalProducts = productsSnapshot.size;

      // Get total orders
      const ordersSnapshot = await db.collection('orders').get();
      const totalOrders = ordersSnapshot.size;

      // Calculate total revenue
      let totalRevenue = 0;
      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data();
        if (order.total) {
          totalRevenue += order.total;
        }
      });

      // Get total customers (unique users who have placed orders)
      const uniqueCustomers = new Set();
      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data();
        if (order.userId) {
          uniqueCustomers.add(order.userId);
        }
      });

      const stats = {
        totalProducts,
        totalOrders,
        totalCustomers: uniqueCustomers.size,
        totalRevenue
      };

      return res.json({ success: true, stats });
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return res.status(500).json({ success: false, error: 'Failed to get admin statistics' });
    }
  });
});

// Admin authentication endpoint
export const checkAdmin = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { uid } = req.body;

      if (!uid) {
        return res.status(400).json({ success: false, error: 'User ID required' });
      }

      const isUserAdmin = await isAdmin(uid);
      return res.json({ success: true, isAdmin: isUserAdmin });
    } catch (error) {
      console.error('Error checking admin status:', error);
      return res.status(500).json({ success: false, error: 'Failed to check admin status' });
    }
  });
});

// Get all admins (for admin panel)
export const getAdmins = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const adminsSnapshot = await db.collection('admins').get();
      const admins = adminsSnapshot.docs.map(doc => ({
        email: doc.id,
        ...doc.data()
      }));

      // Add the default admin
      admins.unshift({
        email: 'butterfly.auth@gmail.com',
        name: 'Butterfly Authentique Admin',
        isActive: true,
        isDefault: true,
        createdAt: new Date()
      } as any);

      return res.json({ success: true, admins });
    } catch (error) {
      console.error('Error getting admins:', error);
      return res.status(500).json({ success: false, error: 'Failed to get admins' });
    }
  });
});

// Add new admin (for admin panel)
export const addAdmin = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { email, name, currentUserEmail } = req.body;

      // Check if current user is default admin
      if (currentUserEmail !== 'butterfly.auth@gmail.com') {
        return res.status(403).json({
          success: false,
          error: 'Only the default admin can add new admins'
        });
      }

      if (!email || !name) {
        return res.status(400).json({
          success: false,
          error: 'Email and name are required'
        });
      }

      if (email === 'butterfly.auth@gmail.com') {
        return res.status(400).json({
          success: false,
          error: 'Cannot add the default admin'
        });
      }

      // Check if admin already exists
      const existingAdmin = await db.collection('admins').doc(email).get();
      if (existingAdmin.exists) {
        return res.status(400).json({
          success: false,
          error: 'Admin already exists'
        });
      }

      // Add new admin
      await db.collection('admins').doc(email).set({
        email,
        name,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ success: true, message: 'Admin added successfully' });
    } catch (error) {
      console.error('Error adding admin:', error);
      return res.status(500).json({ success: false, error: 'Failed to add admin' });
    }
  });
});

// Remove admin (for admin panel)
export const removeAdmin = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { email, currentUserEmail } = req.body;

      // Check if current user is default admin
      if (currentUserEmail !== 'butterfly.auth@gmail.com') {
        return res.status(403).json({
          success: false,
          error: 'Only the default admin can remove admins'
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      if (email === 'butterfly.auth@gmail.com') {
        return res.status(400).json({
          success: false,
          error: 'Cannot remove the default admin'
        });
      }

      // Remove admin
      await db.collection('admins').doc(email).delete();

      return res.json({ success: true, message: 'Admin removed successfully' });
    } catch (error) {
      console.error('Error removing admin:', error);
      return res.status(500).json({ success: false, error: 'Failed to remove admin' });
    }
  });
});

// Next.js server function for handling static files and routing
export const nextjsServer = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { path } = req;

      // Handle static files
      if (path.startsWith('/_next/')) {
        // For static files, we need to serve them from the .next directory
        // This is a simplified approach - in production, you might want to use a CDN
        return res.status(200).send('Static file handling - implement CDN for production');
      }

      // For all other routes, serve the main HTML file
      // This allows Next.js client-side routing to handle the rest
      return res.status(200).send('Next.js app - client-side routing will handle the rest');
    } catch (error) {
      console.error('Error in nextjs-server:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  });
});

// Initialize Razorpay client (dotenv-based with legacy fallback)
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || functions.config().razorpay?.key_id;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// Create Razorpay order
export const createRazorpayOrder = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;

      if (process.env.NODE_ENV !== 'production') {
        console.log('🔧 [Firebase Function] Creating Razorpay order:', {
          amount,
          currency,
          receipt,
        });
      }

      // Validate required fields
      if (!amount || !receipt) {
        return res.status(400).json({
          success: false,
          error: 'Amount and receipt are required'
        });
      }

      // Create Razorpay order
      const order = await getRazorpay().orders.create({
        amount: amount, // Amount in paise
        currency: currency,
        receipt: receipt,
        notes: notes || {},
      });

      return res.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
      });
    } catch (error) {
      console.error('Error creating Razorpay order:', (error as any)?.message || error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }
  });
});

// Verify Razorpay payment and create order
export const verifyRazorpayPayment = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderData // This will contain cart items, customer info, etc.
      } = req.body;

      if (process.env.NODE_ENV !== 'production') {
        console.log('🔧 [Firebase Function] Verifying payment:', {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
        });
      }

      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderData) {
        return res.status(400).json({
          success: false,
          error: 'Missing payment verification data or order details'
        });
      }

      // Verify signature
      const crypto = require('crypto');
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const keySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;
      if (!keySecret) {
        return res.status(500).json({ success: false, error: 'Payment configuration missing' });
      }
      const signature = crypto
        .createHmac('sha256', keySecret)
        .update(text)
        .digest('hex');

      const isAuthentic = signature === razorpay_signature;

      if (isAuthentic) {
        try {
          // Upsert customer profile and get a customerId
          const customerId = await upsertCustomerProfile(orderData?.customer, orderData?.total || 0);

          // Create order in Firestore
          const orderRef = await db.collection('orders').add({
            orderNumber: `BA-${Date.now()}`,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status: 'pending',
            paymentStatus: 'paid',
            paymentMethod: 'razorpay',
            customerId: customerId || null,
            ...orderData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log('✅ Order created in Firestore with ID:', orderRef.id);

          // ------------------------------------------------------------------
          // AUTOMATIC SHIPROCKET ORDER CREATION
          // ------------------------------------------------------------------
          let shiprocketData = null;
          try {
            console.log('🚀 Initiating automatic Shiprocket order creation...');

            // Construct order object for Shiprocket (need to mimic the Order interface)
            // We use new Date() for createdAt since serverTimestamp() is not readable yet
            const fullOrderData = {
              id: orderRef.id,
              orderNumber: `BA-${Date.now()}`,
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              status: 'pending',
              paymentStatus: 'paid',
              paymentMethod: 'razorpay',
              customerId: customerId || null,
              ...orderData,
              createdAt: { toDate: () => new Date() }, // Mock Timestamp for Shiprocket helper
            };

            const srResponse = await createShiprocketOrder(fullOrderData);

            if (srResponse && srResponse.order_id) {
              shiprocketData = {
                orderId: srResponse.order_id,
                shipmentId: srResponse.shipment_id,
                shipmentStatus: 'CREATED',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
              };

              // Update Firestore with Shiprocket details
              await orderRef.update({
                shiprocket: shiprocketData
              });

              console.log('✅ Shiprocket order synced automatically');
            }
          } catch (srError) {
            console.error('⚠️ Failed to create Shiprocket order automatically:', srError);
            // We don't fail the whole request, just log the error
            // The admin can still manually create it from the dashboard
          }

          return res.json({
            success: true,
            verified: true,
            message: 'Payment verified and order created successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            firestoreOrderId: orderRef.id,
            orderNumber: `BA-${Date.now()}`,
            customerId: customerId || null,
            shiprocket: shiprocketData // Return Shiprocket status to client
          });
        } catch (error) {
          console.error('Error creating order in Firestore:', error);
          return res.status(500).json({
            success: false,
            verified: true,
            message: 'Payment verified but failed to create order',
            error: error.message
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'Payment verification failed',
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to verify payment',
        details: error.message
      });
    }
  });
});

// Razorpay webhook handler for real-time order/payment updates
export const razorpayWebhook = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Verify webhook signature for security
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || functions.config().razorpay?.webhook_secret;
      const signature = req.headers['x-razorpay-signature'];

      if (webhookSecret && signature) {
        const crypto = require('crypto');
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(JSON.stringify(req.body))
          .digest('hex');

        if (signature !== expectedSignature) {
          console.error('Invalid webhook signature');
          return res.status(400).json({ error: 'Invalid signature' });
        }
      }

      const { event, payload } = req.body;
      console.log('Razorpay webhook event:', event, payload);

      switch (event) {
        case 'payment.captured':
        case 'payment.failed':
        case 'order.paid':
          await handlePaymentUpdate(payload);
          break;

        case 'refund.created':
        case 'refund.processed':
          await handleRefundUpdate(payload);
          break;

        default:
          console.log('Unhandled webhook event:', event);
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  });
});

// Handle payment status updates from webhook
const handlePaymentUpdate = async (payment: any) => {
  try {
    const orderId = payment.order_id;
    if (!orderId) return;

    // Find order by Razorpay order ID
    const ordersQuery = await db.collection('orders')
      .where('razorpayOrderId', '==', orderId)
      .limit(1)
      .get();

    if (ordersQuery.empty) {
      console.log('Order not found for Razorpay ID:', orderId);
      return;
    }

    const orderDoc = ordersQuery.docs[0];
    const updateData: any = {
      razorpayPaymentId: payment.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Update payment status based on payment status
    if (payment.status === 'captured') {
      updateData.paymentStatus = 'paid';
      updateData.status = 'confirmed';
    } else if (payment.status === 'failed') {
      updateData.paymentStatus = 'failed';
    }

    await orderDoc.ref.update(updateData);
    console.log('Order updated from webhook:', orderDoc.id);
  } catch (error) {
    console.error('Error handling payment update:', error);
  }
};

// Handle refund updates from webhook
const handleRefundUpdate = async (refund: any) => {
  try {
    const paymentId = refund.payment_id;
    if (!paymentId) return;

    // Find order by Razorpay payment ID
    const ordersQuery = await db.collection('orders')
      .where('razorpayPaymentId', '==', paymentId)
      .limit(1)
      .get();

    if (ordersQuery.empty) {
      console.log('Order not found for payment ID:', paymentId);
      return;
    }

    const orderDoc = ordersQuery.docs[0];
    const updateData: any = {
      paymentStatus: 'refunded',
      status: 'refunded',
      refundId: refund.id,
      refundAmount: refund.amount / 100, // Convert from paise to rupees
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await orderDoc.ref.update(updateData);
    console.log('Order refund updated from webhook:', orderDoc.id);
  } catch (error) {
    console.error('Error handling refund update:', error);
  }
};

// Admin API to manually sync orders with Razorpay
export const syncOrdersWithRazorpay = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      // Verify admin authentication
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const isAdminUser = await isAdmin(decodedToken.uid, decodedToken.email);

      if (!isAdminUser) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // Initialize Razorpay client
      const razorpayKeyId = functions.config().razorpay?.key_id;
      const razorpayKeySecret = functions.config().razorpay?.key_secret;

      if (!razorpayKeyId || !razorpayKeySecret) {
        return res.status(500).json({ error: 'Razorpay credentials not configured' });
      }

      const razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      });

      // Get orders from last 30 days or specific date range
      const { startDate, endDate, orderId, importMissing } = req.body || {};
      let syncCount = 0;
      let errorCount = 0;
      let createdCount = 0;

      if (orderId) {
        // Sync specific order
        const result = await syncSingleOrder(razorpay, orderId);
        syncCount = result.success ? 1 : 0;
        errorCount = result.success ? 0 : 1;
      } else {
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        if (importMissing) {
          const result = await importOrdersInDateRange(razorpay, start, end);
          syncCount = result.syncCount;
          errorCount = result.errorCount;
          createdCount = result.createdCount;
        } else {
          const result = await syncOrdersInDateRange(razorpay, start, end);
          syncCount = result.syncCount;
          errorCount = result.errorCount;
        }
      }

      return res.json({
        success: true,
        message: `Sync completed: ${syncCount} updated, ${createdCount} created, ${errorCount} errors`,
        syncCount,
        createdCount,
        errorCount,
      });
    } catch (error) {
      console.error('Sync error:', error);
      return res.status(500).json({ error: 'Sync failed', details: error.message });
    }
  });
});

// Sync a single order with Razorpay
const syncSingleOrder = async (razorpay: any, orderId: string) => {
  try {
    // Find order in Firestore
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return { success: false, error: 'Order not found' };
    }

    const orderData = orderDoc.data();
    const razorpayOrderId = orderData?.razorpayOrderId;

    if (!razorpayOrderId) {
      return { success: false, error: 'No Razorpay order ID found' };
    }

    // Fetch payments for this order
    const payments = await razorpay.orders.fetchPayments(razorpayOrderId);

    // Update order with latest Razorpay data
    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (payments.items && payments.items.length > 0) {
      const latestPayment = payments.items[0];
      updateData.razorpayPaymentId = latestPayment.id;

      if (latestPayment.status === 'captured') {
        updateData.paymentStatus = 'paid';
        updateData.status = orderData.status === 'pending' ? 'confirmed' : orderData.status;
      } else if (latestPayment.status === 'failed') {
        updateData.paymentStatus = 'failed';
      }
    }

    await orderDoc.ref.update(updateData);
    return { success: true };
  } catch (error) {
    console.error('Error syncing single order:', error);
    return { success: false, error: error.message };
  }
};

// Sync orders in a date range
const syncOrdersInDateRange = async (razorpay: any, startDate: Date, endDate: Date) => {
  try {
    let syncCount = 0;
    let errorCount = 0;

    // Get orders from Firestore in date range
    const ordersQuery = await db.collection('orders')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(endDate))
      .where('razorpayOrderId', '!=', '')
      .get();

    // Process orders in batches to avoid rate limits
    const batchSize = 10;
    const orders = ordersQuery.docs;

    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);

      await Promise.all(batch.map(async (orderDoc) => {
        try {
          const result = await syncSingleOrder(razorpay, orderDoc.id);
          if (result.success) {
            syncCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Error syncing order:', orderDoc.id, error);
          errorCount++;
        }
      }));

      // Add delay between batches to respect rate limits
      if (i + batchSize < orders.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { syncCount, errorCount };
  } catch (error) {
    console.error('Error syncing orders in date range:', error);
    throw error;
  }
};

// Import missing orders from Razorpay into Firestore for a date range
const importOrdersInDateRange = async (razorpay: any, startDate: Date, endDate: Date) => {
  try {
    let syncCount = 0;
    let createdCount = 0;
    let errorCount = 0;

    const from = Math.floor(startDate.getTime() / 1000);
    const to = Math.floor(endDate.getTime() / 1000);
    const pageSize = 100;
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const resp = await razorpay.orders.all({ from, to, count: pageSize, skip });
      const items = resp && resp.items ? resp.items : [];
      hasMore = items.length === pageSize;
      skip += items.length;

      for (const rzpOrder of items) {
        try {
          // Check if we already have this order in Firestore
          const existing = await db.collection('orders')
            .where('razorpayOrderId', '==', rzpOrder.id)
            .limit(1)
            .get();

          if (!existing.empty) {
            // Update with latest payment if needed
            const result = await syncSingleOrder(razorpay, existing.docs[0].id);
            if (result.success) syncCount++; else errorCount++;
            continue;
          }

          // Fetch payments for this order
          const payments = await razorpay.orders.fetchPayments(rzpOrder.id);
          const latestPayment = payments.items && payments.items.length > 0 ? payments.items[0] : null;

          // Build a basic order document
          const orderDoc: any = {
            orderNumber: `BA-${rzpOrder.created_at}`,
            razorpayOrderId: rzpOrder.id,
            razorpayPaymentId: latestPayment?.id || null,
            paymentStatus: latestPayment?.status === 'captured' ? 'paid' : (latestPayment?.status || 'failed'),
            status: latestPayment?.status === 'captured' ? 'confirmed' : 'pending',
            paymentMethod: 'razorpay',
            subtotal: (rzpOrder.amount / 100) || 0,
            shipping: 0,
            discount: 0,
            tax: 0,
            total: (rzpOrder.amount / 100) || 0,
            currency: rzpOrder.currency || 'INR',
            customer: {
              name: rzpOrder.notes?.name || null,
              email: rzpOrder.notes?.email || null,
              phone: rzpOrder.notes?.contact || null,
              address: rzpOrder.notes?.address ? { street: rzpOrder.notes.address } : null,
            },
            items: [],
            source: 'import',
            createdAt: admin.firestore.Timestamp.fromMillis(rzpOrder.created_at * 1000),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          // Upsert customer profile for imported order
          const customerId = await upsertCustomerProfile(orderDoc.customer, orderDoc.total);
          if (customerId) orderDoc.customerId = customerId;

          await db.collection('orders').add(orderDoc);
          createdCount++;
        } catch (e) {
          console.error('Error importing order:', rzpOrder?.id, e);
          errorCount++;
        }
      }
    }

    return { syncCount, createdCount, errorCount };
  } catch (error) {
    console.error('Error importing orders in date range:', error);
    throw error;
  }
};

// Export Shipping webhook handler (renamed to avoid Shiprocket URL restrictions)
export { shippingWebhook } from './shippingWebhook';