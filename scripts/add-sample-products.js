const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
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

// Sample products with proper image URLs
const sampleProducts = [
  {
    name: "Butterfly Authentique Signature Necklace",
    description: "A beautiful handcrafted necklace featuring our signature butterfly design. Made with premium materials and attention to detail.",
    shortDescription: "Elegant butterfly necklace with premium finish",
    price: 89.99,
    comparePrice: 119.99,
    costPrice: 45.00,
    sku: "BA-NECK-001",
    category: "jewelry",
    tags: ["necklace", "butterfly", "signature", "premium"],
    status: "active",
    isActive: true,
    isFeatured: true,
    viewCount: 150,
    purchaseCount: 25,
    rating: 4.8,
    reviews: 12,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop"
    ],
    inStock: true,
    stockQuantity: 15,
    lowStockThreshold: 5,
    weight: "0.05",
    dimensions: "2.5 x 1.5 x 0.3 inches",
    materials: "Sterling Silver, Crystal",
    careInstructions: "Store in a cool, dry place. Clean with a soft cloth.",
    slug: "butterfly-authentique-signature-necklace",
    metaTitle: "Butterfly Authentique Signature Necklace - Premium Jewelry",
    metaDescription: "Discover our signature butterfly necklace, handcrafted with premium materials. Perfect for any occasion.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Elegant Butterfly Earrings",
    description: "Delicate butterfly earrings perfect for any occasion. Lightweight and comfortable for all-day wear.",
    shortDescription: "Delicate butterfly earrings for everyday elegance",
    price: 45.99,
    comparePrice: 65.99,
    costPrice: 25.00,
    sku: "BA-EARR-001",
    category: "jewelry",
    tags: ["earrings", "butterfly", "elegant", "lightweight"],
    status: "active",
    isActive: true,
    isFeatured: true,
    viewCount: 89,
    purchaseCount: 18,
    rating: 4.6,
    reviews: 8,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop"
    ],
    inStock: true,
    stockQuantity: 22,
    lowStockThreshold: 5,
    weight: "0.02",
    dimensions: "1.2 x 0.8 x 0.2 inches",
    materials: "Sterling Silver, Pearl",
    careInstructions: "Store in jewelry box. Avoid contact with perfumes and lotions.",
    slug: "elegant-butterfly-earrings",
    metaTitle: "Elegant Butterfly Earrings - Lightweight & Comfortable",
    metaDescription: "Beautiful butterfly earrings perfect for any occasion. Lightweight and comfortable for all-day wear.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Butterfly Garden Bracelet",
    description: "A stunning bracelet featuring multiple butterfly charms. Perfect for adding a touch of nature to your style.",
    shortDescription: "Charming bracelet with multiple butterfly designs",
    price: 67.99,
    comparePrice: 89.99,
    costPrice: 35.00,
    sku: "BA-BRAC-001",
    category: "jewelry",
    tags: ["bracelet", "butterfly", "charms", "garden"],
    status: "active",
    isActive: true,
    isFeatured: false,
    viewCount: 67,
    purchaseCount: 12,
    rating: 4.7,
    reviews: 6,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop"
    ],
    inStock: true,
    stockQuantity: 8,
    lowStockThreshold: 3,
    weight: "0.08",
    dimensions: "7.5 x 0.5 x 0.3 inches",
    materials: "Sterling Silver, Enamel",
    careInstructions: "Store in a cool, dry place. Clean gently with a soft brush.",
    slug: "butterfly-garden-bracelet",
    metaTitle: "Butterfly Garden Bracelet - Nature-Inspired Jewelry",
    metaDescription: "Beautiful bracelet with multiple butterfly charms. Perfect for nature lovers and style enthusiasts.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function addSampleProducts() {
  try {
    console.log('🚀 Starting to add sample products...');

    // Add products
    console.log('🛍️ Adding products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
      console.log(`✅ Added product: ${product.name}`);
    }

    console.log('🎉 Sample products added successfully!');
    console.log(`📊 Added ${sampleProducts.length} products`);
    
  } catch (error) {
    console.error('❌ Error adding sample products:', error);
  }
}

// Run the script
addSampleProducts(); 