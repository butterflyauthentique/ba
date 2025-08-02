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

async function checkProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    const querySnapshot = await getDocs(collection(db, 'products'));
    
    if (querySnapshot.empty) {
      console.log('❌ No products found in database');
      return;
    }
    
    console.log(`✅ Found ${querySnapshot.docs.length} products:`);
    console.log('');
    
    const categories = new Set();
    
    querySnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.name || 'Unnamed Product'}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Status: ${data.status || 'unknown'}`);
      console.log(`   Category: ${data.category || 'uncategorized'}`);
      console.log(`   Price: $${data.price || '0'}`);
      console.log(`   Images: ${data.images ? data.images.length : 0}`);
      console.log('');
      
      if (data.category) {
        categories.add(data.category);
      }
    });
    
    console.log('📊 Available Categories:');
    console.log(Array.from(categories).join(', '));
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  }
}

checkProducts(); 