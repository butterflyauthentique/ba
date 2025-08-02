'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { WishlistService } from '@/lib/services/wishlistService';
import { WishlistItem } from '@/types/database';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  ArrowRight,
  Package,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      loadWishlist();
    } else if (!loading && !user) {
      setLoadingWishlist(false);
    }
  }, [user, loading]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      setLoadingWishlist(true);
      const items = await WishlistService.getUserWishlist(user.id);
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const removeFromWishlist = async (itemId: string, productId: string) => {
    if (!user) return;
    
    try {
      setRemovingItem(itemId);
      await WishlistService.removeFromWishlist(user.id, productId);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading || loadingWishlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist</h1>
          <p className="text-gray-600 mb-8">Please log in to view and manage your wishlist items.</p>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Wishlist</h1>
            <p className="text-red-100 text-lg">
              {wishlistItems.length > 0 
                ? `${wishlistItems.length} item${wishlistItems.length === 1 ? '' : 's'} saved for later`
                : 'Save your favorite items for later'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your wishlist by browsing our collection and adding items you love.
              </p>
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            /* Wishlist Items */
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-900">{wishlistItems.length} items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Set(wishlistItems.map(item => item.productCategory)).size} categories
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="font-bold text-gray-900">
                      {formatPrice(wishlistItems.reduce((sum, item) => sum + item.productPrice, 0))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={typeof item.productImage === 'string' ? item.productImage : '/logo.png'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => removeFromWishlist(item.id, item.productId)}
                          disabled={removingItem === item.id}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {removingItem === item.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                          <Heart className="w-3 h-3 fill-current" />
                          Saved
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">{item.productCategory}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.productPrice)}
                          </p>
                          {item.originalPrice && item.originalPrice !== item.productPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Added</p>
                          <p className="text-xs font-medium text-gray-700">
                            {formatDate(item.addedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/product/${item.productSlug}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>

                      {/* Notes */}
                      {item.notes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to shop?</h3>
                <p className="text-gray-600 mb-4">Discover more amazing products to add to your wishlist.</p>
                <Link 
                  href="/shop" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Continue Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 