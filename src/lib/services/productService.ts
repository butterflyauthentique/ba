import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/database';

// Server-side product service (for SSR/SSG)
export class ServerProductService {
  static async getProduct(idOrSlug: string): Promise<Product | null> {
    try {
      console.log('🔍 [Server] Getting product by ID or slug:', idOrSlug);
      
      // First try to get by ID
      const docRef = doc(db, 'products', idOrSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'active') {
          console.log('✅ [Server] Product found by ID');
          return { id: docSnap.id, ...data } as Product;
        }
      }
      
      // If not found by ID, try to find by slug
      console.log('🔍 [Server] Product not found by ID, searching by slug...');
      const q = query(
        collection(db, 'products'), 
        where('slug', '==', idOrSlug),
        where('status', '==', 'active'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log('✅ [Server] Product found by slug');
        return { id: doc.id, ...doc.data() } as Product;
      }
      
      console.log('❌ [Server] Product not found by ID or slug');
      return null;
    } catch (error) {
      console.error('❌ [Server] Error getting product:', error);
      return null;
    }
  }

  static async getProducts(): Promise<Product[]> {
    try {
      console.log('🔍 [Server] Getting all active products...');
      
      // Try the optimized query first (requires composite index)
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        console.log(`✅ [Server] Found ${querySnapshot.docs.length} active products (with index)`);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
      } catch (indexError) {
        console.log('⚠️ [Server] Index not ready, using fallback query...');
        
        // Fallback: Get all products and filter client-side
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        
        const activeProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
          .filter(product => product.status === 'active')
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() || new Date(0);
            const bDate = b.createdAt?.toDate?.() || new Date(0);
            return bDate.getTime() - aDate.getTime();
          });
        
        console.log(`✅ [Server] Found ${activeProducts.length} active products (fallback)`);
        return activeProducts;
      }
    } catch (error) {
      console.error('❌ [Server] Error getting products:', error);
      return [];
    }
  }

  static async getPopularProducts(limitCount: number = 10): Promise<Product[]> {
    try {
      console.log('🔍 [Server] Getting popular products...');
      
      // Try the optimized query first
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          where('isFeatured', '==', true),
          orderBy('viewCount', 'desc'),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        
        console.log(`✅ [Server] Found ${querySnapshot.docs.length} popular products (with index)`);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
      } catch (indexError) {
        console.log('⚠️ [Server] Index not ready, using fallback query for popular products...');
        
        // Fallback: Get all products and filter client-side
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        
                 const popularProducts = querySnapshot.docs
           .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
           .filter(product => product.status === 'active' && product.isFeatured)
           .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
           .slice(0, limitCount);
        
        console.log(`✅ [Server] Found ${popularProducts.length} popular products (fallback)`);
        return popularProducts;
      }
    } catch (error) {
      console.error('❌ [Server] Error getting popular products:', error);
      return [];
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔍 [Server] Getting products by category:', category);
      
      // Try the optimized query first
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        console.log(`✅ [Server] Found ${querySnapshot.docs.length} products in category ${category} (with index)`);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
      } catch (indexError) {
        console.log('⚠️ [Server] Index not ready, using fallback query for category...');
        
        // Fallback: Get all products and filter client-side
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        
        const categoryProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
          .filter(product => product.status === 'active' && product.category === category)
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() || new Date(0);
            const bDate = b.createdAt?.toDate?.() || new Date(0);
            return bDate.getTime() - aDate.getTime();
          });
        
        console.log(`✅ [Server] Found ${categoryProducts.length} products in category ${category} (fallback)`);
        return categoryProducts;
      }
    } catch (error) {
      console.error('❌ [Server] Error getting products by category:', error);
      return [];
    }
  }
}

// Client-side product service (for client components)
export class ClientProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      console.log('🔍 [Client] Getting all active products...');
      
      // Try the optimized query first
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        console.log(`✅ [Client] Found ${querySnapshot.docs.length} active products (with index)`);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
      } catch (indexError) {
        console.log('⚠️ [Client] Index not ready, using fallback query...');
        
        // Fallback: Get all products and filter client-side
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        
        const activeProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
          .filter(product => product.status === 'active')
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() || new Date(0);
            const bDate = b.createdAt?.toDate?.() || new Date(0);
            return bDate.getTime() - aDate.getTime();
          });
        
        console.log(`✅ [Client] Found ${activeProducts.length} active products (fallback)`);
        return activeProducts;
      }
    } catch (error) {
      console.error('❌ [Client] Error getting products:', error);
      return [];
    }
  }

  static async getProduct(idOrSlug: string): Promise<Product | null> {
    try {
      console.log('🔍 [Client] Getting product by ID or slug:', idOrSlug);
      
      // First try to get by ID
      const docRef = doc(db, 'products', idOrSlug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'active') {
          console.log('✅ [Client] Product found by ID');
          return { id: docSnap.id, ...data } as Product;
        }
      }
      
      // If not found by ID, try to find by slug
      console.log('🔍 [Client] Product not found by ID, searching by slug...');
      const q = query(
        collection(db, 'products'), 
        where('slug', '==', idOrSlug),
        where('status', '==', 'active'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log('✅ [Client] Product found by slug');
        return { id: doc.id, ...doc.data() } as Product;
      }
      
      console.log('❌ [Client] Product not found by ID or slug');
      return null;
    } catch (error) {
      console.error('❌ [Client] Error getting product:', error);
      return null;
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔍 [Client] Getting products by category:', category);
      
      // Try the optimized query first
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'active'),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        console.log(`✅ [Client] Found ${querySnapshot.docs.length} products in category ${category} (with index)`);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product);
      } catch (indexError) {
        console.log('⚠️ [Client] Index not ready, using fallback query for category...');
        
        // Fallback: Get all products and filter client-side
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        
        const categoryProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
          .filter(product => product.status === 'active' && product.category === category)
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() || new Date(0);
            const bDate = b.createdAt?.toDate?.() || new Date(0);
            return bDate.getTime() - aDate.getTime();
          });
        
        console.log(`✅ [Client] Found ${categoryProducts.length} products in category ${category} (fallback)`);
        return categoryProducts;
      }
    } catch (error) {
      console.error('❌ [Client] Error getting products by category:', error);
      return [];
    }
  }
}

// Utility functions
export const productService = {
  // Server-side methods
  server: ServerProductService,
  
  // Client-side methods
  client: ClientProductService,
  
  // Legacy methods (for backward compatibility)
  getById: ClientProductService.getProduct,
  getAll: ClientProductService.getProducts,
}; 