#!/usr/bin/env node

/**
 * Firestore Database Setup Script
 * 
 * This script helps you set up Firestore database for your Butterfly Authentique project.
 * 
 * IMPORTANT: You need to manually create the Firestore database in the Firebase Console first.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration - make sure these match your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

console.log('🚀 Butterfly Authentique - Firestore Setup');
console.log('==========================================');

// Check if environment variables are set
if (!firebaseConfig.projectId) {
  console.error('❌ Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set in your .env.local file');
  console.log('\n📝 Please create a .env.local file with the following variables:');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
  console.log('NEXT_PUBLIC_GA_MEASUREMENT_ID=your_measurement_id');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('📋 Project ID:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n🔧 Setting up Firestore database...');

async function setupFirestore() {
  try {
    // Test connection by creating a test document
    console.log('🔍 Testing Firestore connection...');
    
    const testDoc = {
      message: 'Test connection',
      timestamp: Timestamp.now(),
      setup: true
    };
    
    await setDoc(doc(collection(db, 'test'), 'connection-test'), testDoc);
    console.log('✅ Firestore connection successful!');
    
    // Create initial collections structure
    console.log('\n📁 Creating initial collections...');
    
    // Create a sample product to test the products collection
    const sampleProduct = {
      id: 'sample-product-1',
      name: 'Sample Product',
      description: 'This is a sample product for testing',
      shortDescription: 'Sample product',
      price: 999,
      comparePrice: 1299,
      costPrice: 500,
      sku: 'SAMPLE-001',
      category: 'Jewelry',
      subcategory: 'Necklaces',
      tags: ['sample', 'test'],
      vendor: 'Butterfly Authentique',
      productType: 'Handmade Jewelry',
      stock: 10,
      lowStockThreshold: 2,
      isActive: true,
      isFeatured: false,
      weight: '50g',
      dimensions: '40cm',
      shippingClass: 'Standard',
      images: [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&crop=center',
          alt: 'Sample Product',
          isPrimary: true
        }
      ],
      variants: [],
      requiresShipping: true,
      isTaxable: true,
      slug: 'sample-product',
      metaTitle: 'Sample Product',
      metaDescription: 'A sample product for testing',
      badges: ['Sample'],
      materials: 'Sterling Silver',
      artist: 'Sample Artist',
      careInstructions: 'Handle with care',
      warranty: '1 year',
      viewCount: 0,
      purchaseCount: 0,
      rating: 0,
      reviews: 0,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(collection(db, 'products'), 'sample-product-1'), sampleProduct);
    console.log('✅ Sample product created');
    
    // Create sample categories
    const categories = [
      {
        id: 'jewelry',
        name: 'Jewelry',
        description: 'Handcrafted jewelry pieces',
        slug: 'jewelry',
        level: 1,
        order: 1,
        isActive: true,
        productCount: 1,
        metaTitle: 'Jewelry Collection - Butterfly Authentique',
        metaDescription: 'Discover our handcrafted jewelry collection',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'paintings',
        name: 'Paintings',
        description: 'Original artwork and paintings',
        slug: 'paintings',
        level: 1,
        order: 2,
        isActive: true,
        productCount: 0,
        metaTitle: 'Paintings Collection - Butterfly Authentique',
        metaDescription: 'Explore our collection of original paintings',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        id: 'stoles',
        name: 'Stoles',
        description: 'Elegant stoles and scarves',
        slug: 'stoles',
        level: 1,
        order: 3,
        isActive: true,
        productCount: 0,
        metaTitle: 'Stoles Collection - Butterfly Authentique',
        metaDescription: 'Discover elegant stoles and scarves',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];
    
    for (const category of categories) {
      await setDoc(doc(collection(db, 'categories'), category.id), category);
    }
    console.log('✅ Sample categories created');
    
    console.log('\n🎉 Firestore setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to your Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project:', firebaseConfig.projectId);
    console.log('3. Go to Firestore Database in the left sidebar');
    console.log('4. You should now see your collections: products, categories, test');
    console.log('5. Try creating a product in your admin panel now!');
    
  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
    
    if (error.code === 'permission-denied') {
      console.error('\n🔒 Permission denied error!');
      console.log('This usually means:');
      console.log('1. Firestore database is not created yet');
      console.log('2. Security rules are too restrictive');
      console.log('\n📋 Manual setup required:');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Select your project:', firebaseConfig.projectId);
      console.log('3. Click "Firestore Database" in the left sidebar');
      console.log('4. Click "Create database"');
      console.log('5. Choose "Start in test mode" (for development)');
      console.log('6. Select a location (choose closest to your users)');
      console.log('7. Click "Done"');
      console.log('\nAfter creating the database, run this script again.');
    } else if (error.code === 'not-found') {
      console.error('\n🗄️ Database not found!');
      console.log('The Firestore database needs to be created manually.');
      console.log('Follow the steps above to create the database.');
    } else {
      console.error('\n❌ Unexpected error:', error.message);
    }
  }
}

// Run the setup
setupFirestore(); 