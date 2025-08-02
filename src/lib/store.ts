import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/database';
import { useState, useEffect } from 'react';

// Simplified cart item interface
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

// Simplified store interface - only essential client-side state
interface AppState {
  // Cart state (kept for offline capability)
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  
  // UI state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // User preferences
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Form state
  checkoutForm: {
    email: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  updateCheckoutForm: (data: Partial<AppState['checkoutForm']>) => void;
  
  // Utility functions
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      
      addToCart: (item) => {
        set((state) => {
          // Ensure cart is always an array
          const cart = Array.isArray(state.cart) ? state.cart : [];
          
          const existingItem = cart.find(
            cartItem => cartItem.productId === item.productId && 
                       cartItem.variantId === item.variantId
          );
          
          if (existingItem) {
            return {
              cart: cart.map(cartItem =>
                cartItem.productId === item.productId && 
                cartItem.variantId === item.variantId
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              )
            };
          }
          
          return { cart: [...cart, item] };
        });
      },
      
      removeFromCart: (productId, variantId) => {
        set((state) => {
          // Ensure cart is always an array
          const cart = Array.isArray(state.cart) ? state.cart : [];
          
          return {
            cart: cart.filter(
              item => !(item.productId === productId && item.variantId === variantId)
            )
          };
        });
      },
      
      updateCartQuantity: (productId, quantity, variantId) => {
        set((state) => {
          // Ensure cart is always an array
          const cart = Array.isArray(state.cart) ? state.cart : [];
          
          return {
            cart: cart.map(item =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity }
                : item
            ).filter(item => item.quantity > 0)
          };
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      // UI state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Theme state
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Checkout form state
      checkoutForm: {
        email: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      },
      
      updateCheckoutForm: (data) => {
        set((state) => ({
          checkoutForm: { ...state.checkoutForm, ...data }
        }));
      },
      
      // Utility functions
      getCartTotal: () => {
        const { cart } = get();
        const safeCart = Array.isArray(cart) ? cart : [];
        return safeCart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartItemCount: () => {
        const { cart } = get();
        const safeCart = Array.isArray(cart) ? cart : [];
        return safeCart.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'butterfly-authentique-store',
      partialize: (state) => ({
        cart: state.cart,
        theme: state.theme,
        checkoutForm: state.checkoutForm
      })
    }
  )
);

// Remove the old Firebase-dependent functions
// Products will be fetched directly from Firebase when needed
// No more local caching of Firebase data

// Custom hook to handle hydration safely
export const useHydratedStore = () => {
  const store = useAppStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? store : {
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateCartQuantity: () => {},
    clearCart: () => {},
    isLoading: false,
    setLoading: () => {},
    theme: 'light' as const,
    setTheme: () => {},
    checkoutForm: {
      email: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    updateCheckoutForm: () => {},
    getCartTotal: () => 0,
    getCartItemCount: () => 0
  };
}; 