'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { CartItem } from '@/lib/store';
import { productService } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { Product } from '@/types/database';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const allProducts = await productService.getAll();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products for cart:', error);
        toast.error('Failed to load product information');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const cartItems = cart || [];
  
  // Group items by productId and variantId to handle duplicates properly
  const groupedItems = cartItems.reduce((groups, item) => {
    const key = `${item.productId}-${item.variantId || 'default'}`;
    if (!groups[key]) {
      groups[key] = {
        ...item,
        totalQuantity: item.quantity
      };
    } else {
      groups[key].totalQuantity += item.quantity;
    }
    return groups;
  }, {} as Record<string, CartItem & { totalQuantity: number }>);

  const uniqueCartItems = Object.values(groupedItems);
  const hasItems = uniqueCartItems.length > 0;



  // Calculate totals (GST already included in product prices)
  const subtotal = uniqueCartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product?.price || 0) * item.totalQuantity;
  }, 0);

  const shipping = subtotal > 0 ? (subtotal >= 900 ? 0 : 200) : 0;
  const tax = 0; // No additional GST charged to customer
  const total = subtotal + shipping; // Total is subtotal + shipping (GST already included in prices)

  const handleQuantityChange = (productId: string, newQuantity: number, variantId?: string) => {
    if (newQuantity < 1) return;
            updateCartQuantity(productId, newQuantity, variantId);
  };

  const handleRemoveItem = (productId: string, variantId?: string) => {
    removeFromCart(productId, variantId);
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Will be implemented with payment integration
    setTimeout(() => {
      setIsLoading(false);
      alert('Checkout functionality will be implemented with payment integration');
    }, 1000);
  };

  // Show loading state while fetching products
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
              Loading Cart...
            </h1>
            <p className="text-gray-600">
              Please wait while we load your cart items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="font-secondary text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. 
              Start shopping to discover our beautiful collection!
            </p>
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link href="/shop" className="btn-icon flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-secondary text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {uniqueCartItems.length} {uniqueCartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-secondary text-xl font-bold text-gray-900">
                  Cart Items
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {uniqueCartItems.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) {
                    console.warn(`Product not found for cart item: ${item.productId}`);
                    return (
                      <div key={`missing-${item.productId}-${index}`} className="p-6 border-l-4 border-red-500 bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-700 font-medium">Product not found</p>
                            <p className="text-red-600 text-sm">Product ID: {item.productId}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  }



                  // Create a unique key for each cart item
                  const uniqueKey = `${item.productId}-${item.variantId || 'default'}-${index}`;

                  return (
                    <div key={uniqueKey} className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <Image
                            src={
                              (Array.isArray(product.images) && product.images.length > 0 
                                ? (typeof product.images[0] === 'string' 
                                    ? product.images[0] 
                                    : product.images[0]?.url || '/logo.png')
                                : '/logo.png')
                            }
                            alt={product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.totalQuantity - 1, item.variantId)}
                                  className="p-2 hover:bg-gray-50 transition-colors"
                                  disabled={item.totalQuantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                  {item.totalQuantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.totalQuantity + 1, item.variantId)}
                                  className="p-2 hover:bg-gray-50 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ₹{(product.price * item.totalQuantity).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ₹{product.price.toLocaleString()} each
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.productId, item.variantId)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="font-secondary text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (GST Included)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center mb-4">
                * All prices include 18% GST
              </div>

              {/* Shipping Info */}
              {subtotal > 0 && subtotal < 900 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    Add ₹{(900 - subtotal).toLocaleString()} more to get free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              {/* Continue Shopping */}
              <Link 
                href="/shop" 
                className="btn-secondary w-full flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 