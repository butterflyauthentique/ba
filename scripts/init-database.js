const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "butterflyauthentique",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data (Shopify-style structure)
const sampleProducts = [
  {
    name: 'Handcrafted Silver Necklace',
    description: 'Beautiful handcrafted silver necklace with traditional design and intricate details. Perfect for special occasions.',
    shortDescription: 'Traditional silver necklace by Ashwini A. Nanal',
    price: 2499,
    comparePrice: 2999,
    costPrice: 1200,
    sku: 'BA-NECK-001',
    barcode: '123456789018',
    category: 'Jewelry',
    categorySlug: 'jewelry',
    subcategory: 'Necklaces',
    subcategorySlug: 'necklaces',
    tags: ['handmade', 'silver', 'traditional', 'butterfly-authentique'],
    vendor: 'Butterfly Authentique',
    productType: 'Handcrafted Jewelry',
    stock: 15,
    lowStockThreshold: 5,
    artist: 'Ashwini A. Nanal',
    materials: 'Sterling Silver',
    dimensions: '18 inches',
    weight: '25g',
    shippingClass: 'Standard Shipping',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center'
    ],
    videos: [],
    featuredImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&crop=center',
    variants: [
      { 
        id: 'variant-1',
        name: '18 inches', 
        price: 2499, 
        comparePrice: 2999, 
        sku: 'BA-NECK-001-18', 
        stock: 10, 
        weight: '25g', 
        inStock: true 
      },
      { 
        id: 'variant-2',
        name: '20 inches', 
        price: 2699, 
        comparePrice: 3199, 
        sku: 'BA-NECK-001-20', 
        stock: 5, 
        weight: '28g', 
        inStock: true 
      }
    ],
    isActive: true,
    isFeatured: true,
    requiresShipping: true,
    isTaxable: true,
    slug: 'handcrafted-silver-necklace-ashwini',
    metaTitle: 'Handcrafted Silver Necklace by Ashwini A. Nanal',
    metaDescription: 'Beautiful handcrafted silver necklace with traditional design and intricate details by Ashwini A. Nanal',
    badges: ['Bestseller', 'Handmade', 'Staff Pick'],
    careInstructions: 'Store in a cool, dry place. Clean with a soft cloth.',
    warranty: '1 year warranty',
    rating: 4.8,
    reviews: 24,
    viewCount: 156,
    purchaseCount: 18,
    status: 'active'
  },
  {
    name: 'Artistic Canvas Painting',
    description: 'Original canvas painting depicting cultural heritage with vibrant colors and traditional motifs.',
    shortDescription: 'Cultural heritage painting by Amol V. Nanal',
    price: 3999,
    comparePrice: 4999,
    costPrice: 2000,
    sku: 'BA-PAINT-001',
    barcode: '123456789019',
    category: 'Paintings',
    categorySlug: 'paintings',
    subcategory: 'Oil Paintings',
    subcategorySlug: 'oil-paintings',
    tags: ['original', 'cultural', 'heritage', 'butterfly-authentique'],
    vendor: 'Butterfly Authentique',
    productType: 'Original Artwork',
    stock: 5,
    lowStockThreshold: 2,
    artist: 'Amol V. Nanal',
    materials: 'Oil on Canvas',
    dimensions: '24" x 36"',
    weight: '2kg',
    shippingClass: 'Fragile Items',
    images: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center'
    ],
    videos: [],
    featuredImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center',
    variants: [],
    isActive: true,
    isFeatured: false,
    requiresShipping: true,
    isTaxable: true,
    slug: 'artistic-canvas-painting-amol',
    metaTitle: 'Artistic Canvas Painting by Amol V. Nanal',
    metaDescription: 'Original canvas painting depicting cultural heritage with vibrant colors and traditional motifs by Amol V. Nanal',
    badges: ['Original Artwork', 'Award Winning'],
    careInstructions: 'Keep away from direct sunlight. Frame professionally.',
    warranty: 'Lifetime authenticity guarantee',
    rating: 4.9,
    reviews: 18,
    viewCount: 89,
    purchaseCount: 3,
    status: 'active'
  },
  {
    name: 'Silk Embroidered Stole',
    description: 'Elegant silk stole with intricate embroidery work, perfect for traditional and modern occasions.',
    shortDescription: 'Luxurious silk stole with hand embroidery',
    price: 1899,
    comparePrice: 2299,
    costPrice: 800,
    sku: 'BA-STOLE-001',
    barcode: '123456789020',
    category: 'Stoles',
    categorySlug: 'stoles',
    subcategory: 'Silk Stoles',
    subcategorySlug: 'silk-stoles',
    tags: ['silk', 'embroidered', 'elegant', 'butterfly-authentique'],
    vendor: 'Butterfly Authentique',
    productType: 'Handcrafted Textile',
    stock: 25,
    lowStockThreshold: 8,
    artist: 'Butterfly Authentique',
    materials: 'Pure Silk',
    dimensions: '2.5m x 1m',
    weight: '150g',
    shippingClass: 'Standard Shipping',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'
    ],
    videos: [],
    featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
    variants: [
      { 
        id: 'variant-1',
        name: 'Red', 
        price: 1899, 
        comparePrice: 2299, 
        sku: 'BA-STOLE-001-RED', 
        stock: 10, 
        weight: '150g', 
        inStock: true 
      },
      { 
        id: 'variant-2',
        name: 'Blue', 
        price: 1899, 
        comparePrice: 2299, 
        sku: 'BA-STOLE-001-BLUE', 
        stock: 8, 
        weight: '150g', 
        inStock: true 
      },
      { 
        id: 'variant-3',
        name: 'Green', 
        price: 1899, 
        comparePrice: 2299, 
        sku: 'BA-STOLE-001-GREEN', 
        stock: 0, 
        weight: '150g', 
        inStock: false 
      }
    ],
    isActive: true,
    isFeatured: true,
    requiresShipping: true,
    isTaxable: true,
    slug: 'silk-embroidered-stole-butterfly',
    metaTitle: 'Silk Embroidered Stole - Butterfly Authentique',
    metaDescription: 'Elegant silk stole with intricate embroidery work, perfect for traditional and modern occasions',
    badges: ['Bestseller', 'Handmade', 'Staff Pick'],
    careInstructions: 'Dry clean only. Store in a cool, dry place.',
    warranty: '6 months warranty',
    rating: 4.7,
    reviews: 31,
    viewCount: 234,
    purchaseCount: 25,
    status: 'active'
  },
  {
    name: 'Krishna Playing Flute – Divine Melody Spiritual Wall Art',
    description: 'Beautiful spiritual wall art depicting Lord Krishna playing his divine flute, bringing peace and harmony to any space. This handcrafted piece captures the essence of divine melody and spiritual connection.',
    shortDescription: 'Divine Krishna flute spiritual wall art for peace and harmony',
    price: 5999,
    comparePrice: 7499,
    costPrice: 3000,
    sku: 'WALL-KRISHNA-001',
    barcode: '123456789020',
    category: 'Paintings',
    categorySlug: 'paintings',
    subcategory: 'Spiritual Art',
    subcategorySlug: 'spiritual-art',
    tags: ['spiritual', 'krishna', 'flute', 'divine', 'wall-art', 'handmade', 'butterfly-authentique'],
    vendor: 'Butterfly Authentique',
    productType: 'Spiritual Wall Art',
    stock: 3,
    lowStockThreshold: 1,
    artist: 'Traditional Artist',
    materials: 'Canvas, Acrylic Paint',
    dimensions: '36" x 24"',
    weight: '1.5kg',
    shippingClass: 'Fragile Items',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&crop=center'
    ],
    videos: [],
    featuredImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
    variants: [
      { 
        id: 'variant-1',
        name: '36" x 24"', 
        price: 5999, 
        comparePrice: 7499, 
        sku: 'WALL-KRISHNA-001-36x24', 
        stock: 2, 
        weight: '1.5kg', 
        inStock: true 
      },
      { 
        id: 'variant-2',
        name: '48" x 32"', 
        price: 7999, 
        comparePrice: 9499, 
        sku: 'WALL-KRISHNA-001-48x32', 
        stock: 1, 
        weight: '2kg', 
        inStock: true 
      }
    ],
    isActive: true,
    isFeatured: true,
    requiresShipping: true,
    isTaxable: true,
    slug: 'krishna-playing-flute-divine-melody-spiritual-wall-art',
    metaTitle: 'Krishna Playing Flute – Divine Melody Spiritual Wall Art',
    metaDescription: 'Beautiful spiritual wall art depicting Lord Krishna playing his divine flute. Handcrafted piece for peace and harmony.',
    badges: ['Spiritual', 'Handmade', 'Featured'],
    careInstructions: 'Keep away from direct sunlight. Dust gently with a soft cloth.',
    warranty: '1 year warranty',
    rating: 4.9,
    reviews: 8,
    viewCount: 45,
    purchaseCount: 2,
    status: 'active'
  }
];

// Categories data
const categories = [
  {
    name: 'Jewelry',
    description: 'Handcrafted jewelry pieces',
    slug: 'jewelry',
    level: 1,
    order: 1,
    isActive: true,
    productCount: 0,
    metaTitle: 'Jewelry Collection - Butterfly Authentique',
    metaDescription: 'Discover our handcrafted jewelry collection featuring traditional designs and modern elegance.'
  },
  {
    name: 'Paintings',
    description: 'Original artwork and paintings',
    slug: 'paintings',
    level: 1,
    order: 2,
    isActive: true,
    productCount: 0,
    metaTitle: 'Paintings Collection - Butterfly Authentique',
    metaDescription: 'Explore our collection of original paintings and artwork.'
  },
  {
    name: 'Stoles',
    description: 'Elegant stoles and shawls',
    slug: 'stoles',
    level: 1,
    order: 3,
    isActive: true,
    productCount: 0,
    metaTitle: 'Stoles Collection - Butterfly Authentique',
    metaDescription: 'Luxurious stoles and shawls for every occasion.'
  },
  {
    name: 'Home Decor',
    description: 'Home decoration items',
    slug: 'home-decor',
    level: 1,
    order: 4,
    isActive: true,
    productCount: 0,
    metaTitle: 'Home Decor Collection - Butterfly Authentique',
    metaDescription: 'Beautiful home decoration pieces to enhance your living space.'
  },
  {
    name: 'Accessories',
    description: 'Fashion accessories and more',
    slug: 'accessories',
    level: 1,
    order: 5,
    isActive: true,
    productCount: 0,
    metaTitle: 'Accessories Collection - Butterfly Authentique',
    metaDescription: 'Stylish accessories to complement your look.'
  }
];

// Subcategories data
const subcategories = [
  // Jewelry subcategories
  { name: 'Necklaces', parentSlug: 'jewelry', slug: 'necklaces', level: 2, order: 1 },
  { name: 'Earrings', parentSlug: 'jewelry', slug: 'earrings', level: 2, order: 2 },
  { name: 'Bracelets', parentSlug: 'jewelry', slug: 'bracelets', level: 2, order: 3 },
  { name: 'Rings', parentSlug: 'jewelry', slug: 'rings', level: 2, order: 4 },
  { name: 'Anklets', parentSlug: 'jewelry', slug: 'anklets', level: 2, order: 5 },
  { name: 'Pendants', parentSlug: 'jewelry', slug: 'pendants', level: 2, order: 6 },
  
  // Paintings subcategories
  { name: 'Oil Paintings', parentSlug: 'paintings', slug: 'oil-paintings', level: 2, order: 1 },
  { name: 'Watercolor', parentSlug: 'paintings', slug: 'watercolor', level: 2, order: 2 },
  { name: 'Acrylic', parentSlug: 'paintings', slug: 'acrylic', level: 2, order: 3 },
  { name: 'Mixed Media', parentSlug: 'paintings', slug: 'mixed-media', level: 2, order: 4 },
  { name: 'Digital Art', parentSlug: 'paintings', slug: 'digital-art', level: 2, order: 5 },
  { name: 'Traditional', parentSlug: 'paintings', slug: 'traditional', level: 2, order: 6 },
  { name: 'Spiritual Art', parentSlug: 'paintings', slug: 'spiritual-art', level: 2, order: 7 },
  
  // Stoles subcategories
  { name: 'Silk Stoles', parentSlug: 'stoles', slug: 'silk-stoles', level: 2, order: 1 },
  { name: 'Wool Stoles', parentSlug: 'stoles', slug: 'wool-stoles', level: 2, order: 2 },
  { name: 'Cotton Stoles', parentSlug: 'stoles', slug: 'cotton-stoles', level: 2, order: 3 },
  { name: 'Embroidered Stoles', parentSlug: 'stoles', slug: 'embroidered-stoles', level: 2, order: 4 },
  { name: 'Cashmere Stoles', parentSlug: 'stoles', slug: 'cashmere-stoles', level: 2, order: 5 },
  
  // Home Decor subcategories
  { name: 'Wall Art', parentSlug: 'home-decor', slug: 'wall-art', level: 2, order: 1 },
  { name: 'Vases', parentSlug: 'home-decor', slug: 'vases', level: 2, order: 2 },
  { name: 'Candles', parentSlug: 'home-decor', slug: 'candles', level: 2, order: 3 },
  { name: 'Cushions', parentSlug: 'home-decor', slug: 'cushions', level: 2, order: 4 },
  { name: 'Rugs', parentSlug: 'home-decor', slug: 'rugs', level: 2, order: 5 },
  { name: 'Tableware', parentSlug: 'home-decor', slug: 'tableware', level: 2, order: 6 },
  
  // Accessories subcategories
  { name: 'Bags', parentSlug: 'accessories', slug: 'bags', level: 2, order: 1 },
  { name: 'Scarves', parentSlug: 'accessories', slug: 'scarves', level: 2, order: 2 },
  { name: 'Belts', parentSlug: 'accessories', slug: 'belts', level: 2, order: 3 },
  { name: 'Hair Accessories', parentSlug: 'accessories', slug: 'hair-accessories', level: 2, order: 4 },
  { name: 'Jewelry Boxes', parentSlug: 'accessories', slug: 'jewelry-boxes', level: 2, order: 5 }
];

// Initialize database
async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Butterfly Authentique Firestore Database...');
    
    // Create categories
    console.log('📂 Creating categories...');
    for (const category of categories) {
      const categoryRef = doc(db, 'categories', category.slug);
      await setDoc(categoryRef, {
        ...category,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create subcategories
    console.log('📂 Creating subcategories...');
    for (const subcategory of subcategories) {
      const parentCategory = categories.find(c => c.slug === subcategory.parentSlug);
      const subcategoryRef = doc(db, 'categories', subcategory.slug);
      await setDoc(subcategoryRef, {
        ...subcategory,
        parentId: parentCategory?.slug,
        description: `${subcategory.name} in ${parentCategory?.name}`,
        isActive: true,
        productCount: 0,
        metaTitle: `${subcategory.name} - ${parentCategory?.name} Collection`,
        metaDescription: `Discover our ${subcategory.name.toLowerCase()} collection in ${parentCategory?.name.toLowerCase()}.`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Created subcategory: ${subcategory.name}`);
    }

    // Create sample products
    console.log('📦 Creating sample products...');
    for (const product of sampleProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`✅ Created product: ${product.name} (ID: ${productRef.id})`);
    }

    // Create default settings
    console.log('⚙️ Creating default settings...');
    const settingsRef = doc(db, 'settings', 'general');
    await setDoc(settingsRef, {
      storeName: 'Butterfly Authentique',
      storeDescription: 'Handcrafted luxury items with traditional elegance',
      currency: 'INR',
      currencySymbol: '₹',
      taxRate: 18,
      shippingMethods: [
        { name: 'Standard Shipping', price: 100, days: '3-5' },
        { name: 'Express Shipping', price: 200, days: '1-2' },
        { name: 'Free Shipping', price: 0, minOrder: 2000, days: '3-5' }
      ],
      contactInfo: {
        email: 'info@butterflyauthentique.com',
        phone: '+91-9876543210',
        address: 'Mumbai, Maharashtra, India'
      },
      socialMedia: {
        facebook: 'https://facebook.com/butterflyauthentique',
        instagram: 'https://instagram.com/butterflyauthentique',
        twitter: 'https://twitter.com/butterflyauthentique'
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log('✅ Created default settings');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUserRef = doc(db, 'users', 'butterfly.auth@gmail.com');
    await setDoc(adminUserRef, {
      email: 'butterfly.auth@gmail.com',
      name: 'Butterfly Authentique Admin',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLoginAt: Timestamp.now()
    });
    console.log('✅ Created admin user: butterfly.auth@gmail.com');

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Subcategories: ${subcategories.length}`);
    console.log(`   • Products: ${sampleProducts.length}`);
    console.log(`   • Admin User: butterfly.auth@gmail.com`);
    console.log('\n🔗 Next Steps:');
    console.log('   1. Configure Firebase environment variables');
    console.log('   2. Set up Firebase Authentication');
    console.log('   3. Configure Firestore security rules');
    console.log('   4. Test the admin panel at http://localhost:9000/admin/');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase(); 