import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, query, where, orderBy, limit, Timestamp, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Product } from '@/types/database';
import { generateProductSlug } from './utils';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug: Log Firebase configuration
console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  storageBucket: firebaseConfig.storageBucket
});

// Collection references
export const collections = {
  products: collection(db, 'products'),
  categories: collection(db, 'categories'),
  users: collection(db, 'users'),
  orders: collection(db, 'orders'),
  cart: collection(db, 'cart'),
  blog: collection(db, 'blog'),
  reviews: collection(db, 'reviews'),
  addresses: collection(db, 'addresses'),
  settings: collection(db, 'settings'),
  admins: collection(db, 'admins')
};

// Function to check if Firestore database exists and is accessible
export const checkFirestoreConnection = async () => {
  try {
    console.log('🔍 Checking Firestore connection...');
    
    // Try to read from a test collection
    const testQuery = query(collection(db, 'test'), limit(1));
    await getDocs(testQuery);
    
    console.log('✅ Firestore connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
};

// Product service
export const productService = {
  // Create a new product
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      console.log('🚀 Creating new product...');
      
      // Generate a simple ID
      const productId = doc(collection(db, 'temp')).id;
      console.log('Generated product ID:', productId);
      
      // Generate slug if not provided
      const slug = productData.slug || generateProductSlug(productData.name, productId);
      console.log('Generated slug:', slug);
      
      // Create product document with default values
      const productDoc = {
        ...productData,
        id: productId,
        slug,
        viewCount: 0,
        purchaseCount: 0,
        rating: 0,
        reviews: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Save to Firestore
      console.log('💾 Saving to Firestore...');
      await setDoc(doc(collections.products, productId), productDoc);
      
      console.log('✅ Product created successfully!');
      return productDoc as Product;
    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw error;
    }
  },

  // Get a product by ID or slug
  async getById(idOrSlug: string): Promise<Product | null> {
    try {
      console.log('🔍 Getting product by ID or slug:', idOrSlug);
      
      // First try to get by ID
      const docRef = doc(collections.products, idOrSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('✅ Product found by ID');
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      
      // If not found by ID, try to find by slug
      console.log('🔍 Product not found by ID, searching by slug...');
      const q = query(collections.products, where('slug', '==', idOrSlug), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log('✅ Product found by slug');
        return { id: doc.id, ...doc.data() } as Product;
      }
      
      console.log('❌ Product not found by ID or slug');
      return null;
    } catch (error) {
      console.error('❌ Error getting product:', error);
      return null;
    }
  },

  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      console.log('🔍 Getting all products...');
      const q = query(collections.products, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log(`✅ Found ${querySnapshot.docs.length} products`);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
    } catch (error) {
      console.error('❌ Error getting products:', error);
      return [];
    }
  },

  // Update a product
  async update(id: string, updates: Partial<Product>): Promise<void> {
    try {
      console.log('🔄 Updating product:', id);
      const docRef = doc(collections.products, id);
      await setDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      }, { merge: true });
      console.log('✅ Product updated successfully');
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  },

  // Delete a product
  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting product:', id);
      await setDoc(doc(collections.products, id), {});
      console.log('✅ Product deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  }
}; 