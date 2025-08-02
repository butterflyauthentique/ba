import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { WishlistItem, Product } from '@/types/database';

export class WishlistService {
  private static collection = 'wishlist';

  // Add item to wishlist
  static async addToWishlist(userId: string, product: Product): Promise<string> {
    try {
      const wishlistItem: Omit<WishlistItem, 'id'> = {
        userId,
        productId: product.id,
        productName: product.name,
        productImage: typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || '',
        productPrice: product.price,
        productSlug: product.slug,
        productCategory: product.category,
        addedAt: serverTimestamp() as any,
        originalPrice: product.price,
        lastPriceCheck: serverTimestamp() as any,
        priority: 'medium',
        isPublic: false
      };

      const docRef = await addDoc(collection(db, this.collection), wishlistItem);
      return docRef.id;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw new Error('Failed to add item to wishlist');
    }
  }

  // Remove item from wishlist
  static async removeFromWishlist(userId: string, productId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        await deleteDoc(doc(db, this.collection, querySnapshot.docs[0].id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove item from wishlist');
    }
  }

  // Get user's wishlist
  static async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('addedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WishlistItem[];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      
      // If index is still building, try a simpler query without ordering
      if (error instanceof Error && error.message && error.message.includes('index is currently building')) {
        console.log('⚠️ Index still building, using fallback query...');
        try {
          const fallbackQuery = query(
            collection(db, this.collection),
            where('userId', '==', userId)
          );
          
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const items = fallbackSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as WishlistItem[];
          
          // Sort manually since we can't use orderBy
          items.sort((a, b) => {
            const aDate = a.addedAt?.toDate?.() || new Date(0);
            const bDate = b.addedAt?.toDate?.() || new Date(0);
            return bDate.getTime() - aDate.getTime();
          });
          
          console.log(`✅ Found ${items.length} wishlist items (fallback query)`);
          return items;
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          throw new Error('Failed to get wishlist');
        }
      }
      
      throw new Error('Failed to get wishlist');
    }
  }

  // Check if item is in wishlist
  static async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      
      // If index is still building, return false for now
      if (error instanceof Error && error.message && error.message.includes('index is currently building')) {
        console.log('⚠️ Index still building, returning false for wishlist status');
        return false;
      }
      
      return false;
    }
  }

  // Update wishlist item
  static async updateWishlistItem(itemId: string, updates: Partial<WishlistItem>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, itemId);
      await updateDoc(docRef, {
        ...updates,
        lastPriceCheck: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating wishlist item:', error);
      throw new Error('Failed to update wishlist item');
    }
  }

  // Get wishlist count
  static async getWishlistCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      
      // If index is still building, return 0 for now
      if (error instanceof Error && error.message && error.message.includes('index is currently building')) {
        console.log('⚠️ Index still building, returning 0 for wishlist count');
        return 0;
      }
      
      return 0;
    }
  }

  // Toggle wishlist item (add if not present, remove if present)
  static async toggleWishlistItem(userId: string, product: Product): Promise<{ added: boolean; itemId?: string }> {
    try {
      const isInWishlist = await this.isInWishlist(userId, product.id);
      
      if (isInWishlist) {
        await this.removeFromWishlist(userId, product.id);
        return { added: false };
      } else {
        const itemId = await this.addToWishlist(userId, product);
        return { added: true, itemId };
      }
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw new Error('Failed to toggle wishlist item');
    }
  }
} 