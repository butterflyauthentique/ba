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

// Sample products data
const sampleProducts = [
  {
    name: "Butterfly Authentique Signature Necklace",
    description: "A beautiful handcrafted necklace featuring our signature butterfly design. Made with premium materials and attention to detail.",
    price: 89.99,
    originalPrice: 119.99,
    category: "jewelry",
    status: "active",
    isActive: true,
    isFeatured: true,
    viewCount: 150,
    purchaseCount: 25,
    rating: 4.8,
    reviews: 12,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
    ],
    tags: ["necklace", "butterfly", "signature", "premium"],
    inStock: true,
    stockQuantity: 15,
    weight: 0.05,
    dimensions: "2.5 x 1.5 x 0.3 inches",
    materials: ["Sterling Silver", "Crystal"],
    care: "Store in a cool, dry place. Clean with a soft cloth.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Elegant Butterfly Earrings",
    description: "Delicate butterfly earrings perfect for any occasion. Lightweight and comfortable for all-day wear.",
    price: 45.99,
    originalPrice: 65.99,
    category: "jewelry",
    status: "active",
    isActive: true,
    isFeatured: true,
    viewCount: 89,
    purchaseCount: 18,
    rating: 4.6,
    reviews: 8,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
    ],
    tags: ["earrings", "butterfly", "elegant", "lightweight"],
    inStock: true,
    stockQuantity: 22,
    weight: 0.02,
    dimensions: "1.2 x 0.8 x 0.2 inches",
    materials: ["Sterling Silver", "Pearl"],
    care: "Store in jewelry box. Avoid contact with perfumes and lotions.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Butterfly Garden Bracelet",
    description: "A stunning bracelet featuring multiple butterfly charms. Perfect for adding a touch of nature to your style.",
    price: 67.99,
    originalPrice: 89.99,
    category: "jewelry",
    status: "active",
    isActive: true,
    isFeatured: false,
    viewCount: 67,
    purchaseCount: 12,
    rating: 4.7,
    reviews: 6,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
    ],
    tags: ["bracelet", "butterfly", "charms", "garden"],
    inStock: true,
    stockQuantity: 8,
    weight: 0.08,
    dimensions: "7.5 x 0.5 x 0.3 inches",
    materials: ["Sterling Silver", "Enamel"],
    care: "Store in a cool, dry place. Clean gently with a soft brush.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Butterfly Wings Ring",
    description: "A unique ring design inspired by butterfly wings. Features intricate detailing and comfortable fit.",
    price: 125.99,
    originalPrice: 159.99,
    category: "jewelry",
    status: "active",
    isActive: true,
    isFeatured: true,
    viewCount: 234,
    purchaseCount: 31,
    rating: 4.9,
    reviews: 15,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
    ],
    tags: ["ring", "butterfly", "wings", "unique"],
    inStock: true,
    stockQuantity: 5,
    weight: 0.12,
    dimensions: "Ring size 7, adjustable",
    materials: ["Sterling Silver", "Diamond"],
    care: "Professional cleaning recommended. Store in ring box.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Butterfly Dream Pendant",
    description: "A dreamy pendant featuring a butterfly in flight. Perfect for layering or wearing alone.",
    price: 78.99,
    originalPrice: 99.99,
    category: "jewelry",
    status: "active",
    isActive: true,
    isFeatured: false,
    viewCount: 112,
    purchaseCount: 19,
    rating: 4.5,
    reviews: 9,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
    ],
    tags: ["pendant", "butterfly", "dream", "layering"],
    inStock: true,
    stockQuantity: 12,
    weight: 0.06,
    dimensions: "1.8 x 1.2 x 0.4 inches",
    materials: ["Sterling Silver", "Sapphire"],
    care: "Store in a cool, dry place. Clean with a soft cloth.",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Sample categories
const sampleCategories = [
  {
    name: "Jewelry",
    description: "Beautiful handcrafted jewelry pieces",
    slug: "jewelry",
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Accessories",
    description: "Stylish accessories to complement your look",
    slug: "accessories",
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    name: "Home Decor",
    description: "Elegant home decoration items",
    slug: "home-decor",
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function addSampleData() {
  try {
    console.log('🚀 Starting to add sample data...');

    // Add categories
    console.log('📂 Adding categories...');
    for (const category of sampleCategories) {
      await addDoc(collection(db, 'categories'), category);
      console.log(`✅ Added category: ${category.name}`);
    }

    // Add products
    console.log('🛍️ Adding products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
      console.log(`✅ Added product: ${product.name}`);
    }

    console.log('🎉 Sample data added successfully!');
    console.log(`📊 Added ${sampleCategories.length} categories and ${sampleProducts.length} products`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

// Run the script
addSampleData(); 