const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  projectId: 'butterflyauthentique33',
  authDomain: 'butterflyauthentique33.firebaseapp.com',
  storageBucket: 'butterflyauthentique33.firebasestorage.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkProductSlugs() {
  try {
    console.log('🔍 Checking all products in database...');
    
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log(`📊 Found ${snapshot.docs.length} total products`);
    
    const products = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        status: data.status,
        category: data.category
      });
    });
    
    console.log('\n📋 All Products:');
    products.forEach(product => {
      console.log(`- ID: ${product.id}`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Slug: ${product.slug}`);
      console.log(`  Status: ${product.status}`);
      console.log(`  Category: ${product.category}`);
      console.log('---');
    });
    
    // Check for the specific product mentioned in the error
    const targetSlug = 'handcrafted-royal-rajasthani-queen-necklace-and-pendant-set';
    const targetProduct = products.find(p => p.slug === targetSlug);
    
    if (targetProduct) {
      console.log(`✅ Found target product: ${targetProduct.name}`);
      console.log(`   ID: ${targetProduct.id}`);
      console.log(`   Status: ${targetProduct.status}`);
    } else {
      console.log(`❌ Target slug "${targetSlug}" not found in database`);
      console.log('Available slugs:');
      products.forEach(p => {
        if (p.slug) console.log(`  - ${p.slug}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  }
}

checkProductSlugs(); 