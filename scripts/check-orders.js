const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkOrders() {
  try {
    console.log('🔍 Checking orders in database...');
    
    const querySnapshot = await getDocs(collection(db, 'orders'));
    
    if (querySnapshot.empty) {
      console.log('❌ No orders found in database');
      return;
    }
    
    console.log(`✅ Found ${querySnapshot.docs.length} orders:`);
    console.log('');
    
    querySnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. Order ID: ${doc.id}`);
      console.log(`   Status: ${data.status || 'unknown'}`);
      console.log(`   Total Amount: ₹${data.totalAmount || '0'}`);
      console.log(`   Customer: ${data.customerName || 'Unknown'}`);
      console.log(`   Date: ${data.createdAt?.toDate?.() || 'Unknown'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking orders:', error);
  }
}

checkOrders(); 