import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
const Razorpay = require('razorpay');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize CORS
const corsHandler = cors({ origin: true });

// Firestore database reference
const db = admin.firestore();

// Admin authentication check
const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await db.collection('admins').doc(uid).get();
    return adminDoc.exists;
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

// Initialize Razorpay with production keys
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

// Create Razorpay order
export const createRazorpayOrder = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;

      console.log('🔧 [Firebase Function] Creating Razorpay order:', {
        amount,
        currency,
        receipt,
        keyId: functions.config().razorpay.key_id,
        isProduction: functions.config().razorpay.key_id.startsWith('rzp_live_')
      });

      // Validate required fields
      if (!amount || !receipt) {
        return res.status(400).json({
          success: false,
          error: 'Amount and receipt are required'
        });
      }

      // Create Razorpay order
      const order = await razorpay.orders.create({
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
      console.error('Error creating Razorpay order:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }
  });
});

// Verify Razorpay payment
export const verifyRazorpayPayment = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      console.log('🔧 [Firebase Function] Verifying payment:', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        keyId: functions.config().razorpay.key_id,
        isProduction: functions.config().razorpay.key_id.startsWith('rzp_live_')
      });

      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: 'Missing payment verification data'
        });
      }

      // Verify signature
      const crypto = require('crypto');
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const signature = crypto
        .createHmac('sha256', functions.config().razorpay.key_secret)
        .update(text)
        .digest('hex');

      const isAuthentic = signature === razorpay_signature;

      if (isAuthentic) {
        return res.json({
          success: true,
          verified: true,
          message: 'Payment verified successfully',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
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
        error: 'Failed to verify payment'
      });
    }
  });
});