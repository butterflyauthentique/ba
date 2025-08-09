const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const { getStorage, ref, getDownloadURL } = require('firebase/storage');

// Firebase config
const firebaseConfig = {
  projectId: 'butterflyauthentique33',
  authDomain: 'butterflyauthentique.in',
  storageBucket: 'butterflyauthentique33.firebasestorage.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function testFirebaseAccess() {
  console.log('🔍 Testing Firebase access...\n');
  
  try {
    // Test 1: Firestore access
    console.log('📊 Test 1: Firestore Products Access');
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    console.log(`✅ Successfully read ${snapshot.docs.length} products from Firestore`);
    
    // Test 2: Specific product access
    console.log('\n📦 Test 2: Specific Product Access');
    const productId = 'YnyYigTiCPF6QDudVvr3'; // The necklace product
    const productDoc = doc(db, 'products', productId);
    const productSnap = await getDoc(productDoc);
    
    if (productSnap.exists()) {
      const product = productSnap.data();
      console.log(`✅ Successfully read product: ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Status: ${product.status}`);
      
      // Test 3: Product images access
      if (product.images && product.images.length > 0) {
        console.log('\n🖼️  Test 3: Product Images Access');
        const imageUrl = typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url;
        
        if (imageUrl) {
          console.log(`   Image URL: ${imageUrl}`);
          
          try {
            // Try to access the image directly
            const imageRef = ref(storage, imageUrl);
            const downloadUrl = await getDownloadURL(imageRef);
            console.log(`✅ Successfully accessed image: ${downloadUrl}`);
          } catch (imageError) {
            console.log(`❌ Failed to access image: ${imageError.message}`);
            
            // Try to extract path from URL
            const urlParts = imageUrl.split('/');
            const bucketIndex = urlParts.findIndex(part => part.includes('firebasestorage'));
            if (bucketIndex !== -1) {
              const pathParts = urlParts.slice(bucketIndex + 2);
              const storagePath = pathParts.join('/');
              console.log(`   Extracted storage path: ${storagePath}`);
              
              try {
                const directRef = ref(storage, storagePath);
                const directUrl = await getDownloadURL(directRef);
                console.log(`✅ Successfully accessed image via direct path: ${directUrl}`);
              } catch (directError) {
                console.log(`❌ Failed to access image via direct path: ${directError.message}`);
              }
            }
          }
        } else {
          console.log('   No image URL found in product data');
        }
      } else {
        console.log('   No images found in product data');
      }
    } else {
      console.log('❌ Product not found');
    }
    
    // Test 4: Check all product images
    console.log('\n🖼️  Test 4: All Product Images');
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.images && data.images.length > 0) {
        console.log(`\n   Product: ${data.name}`);
        data.images.forEach((image, index) => {
          const imageUrl = typeof image === 'string' ? image : image?.url;
          console.log(`     Image ${index + 1}: ${imageUrl}`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing Firebase access:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
  }
}

testFirebaseAccess(); 