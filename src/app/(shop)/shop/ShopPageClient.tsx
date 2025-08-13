'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingBag, 
  Star,
  Plus,
  Minus,
  X,
  Share2
} from 'lucide-react';
import ShareMenu from '@/components/ShareMenu';
import { useHydratedStore } from '@/lib/store';
import { WishlistService } from '@/lib/services/wishlistService';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Product } from '@/types/database';
import { ClientProductService } from '@/lib/services/productService';

interface ShopPageClientProps {
  products: Product[]; // Server-side fetched products
  initialCategory?: string; // Initial category to select
}

export default function ShopPageClient({ 
  products: initialProducts 
}: ShopPageClientProps) {
  const { addToCart } = useHydratedStore();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize category from URL or default to 'all'
  useEffect(() => {
    const categoryFromUrl = searchParams?.get('category');
    
    // If no category in URL, set it to 'all' and update URL
    if (!categoryFromUrl) {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('category', 'all');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
      setSelectedCategory('all');
    } else {
      // Convert to lowercase for consistent comparison
      const normalizedCategory = categoryFromUrl.toLowerCase();
      setSelectedCategory(normalizedCategory);
    }
  }, [searchParams]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('category', selectedCategory);
    
    // Only update if the URL would actually change
    const currentCategory = params.get('category');
    if (currentCategory !== selectedCategory) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [selectedCategory, searchParams]);
  const [sortBy, setSortBy] = useState('name');
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  // Load initial products and filter client-side for better UX
  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await ClientProductService.getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadInitialProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    // Check if product matches the selected category (case-insensitive)
    const matchesCategory = selectedCategory === 'all' || 
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    // Check if product matches the search term
    const matchesSearch = !searchTerm || searchTerm === '' || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.artist?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    } else if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      price: product.price,
      name: product.name,
      image: product.images[0]?.url || ''
    });
    toast.success(`${product.name} added to cart`);
  };

  const shareLinks = (href: string, title: string, description?: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${href}` : href;
    const text = description || title;
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`,
    };
  };

  // Load wishlist items for current user
  useEffect(() => {
    const loadWishlistItems = async () => {
      if (!user) return;
      
      try {
        const items = await WishlistService.getUserWishlist(user.id);
        const productIds = new Set(items.map(item => item.productId));
        setWishlistItems(productIds);
      } catch (error) {
        console.error('Error loading wishlist items:', error);
      }
    };

    loadWishlistItems();
  }, [user]);

  const handleAddToWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      return;
    }

    try {
      const result = await WishlistService.toggleWishlistItem(user.id, product);
      
      if (result.added) {
        setWishlistItems(prev => new Set([...prev, product.id]));
        toast.success('Added to wishlist');
      } else {
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  // Get unique categories from initial products (not filtered products)
  const categories = ['all', ...Array.from(new Set(initialProducts.map(p => p.category.toLowerCase())))];
  
  // Format category for display (capitalize first letter)
  const formatCategory = (category: string) => {
    if (category === 'all') return 'All Categories';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Shop</h1>
              <p className="text-sm sm:text-base text-white/90 mt-1">Discover handcrafted pieces</p>
            </div>
            <div className="text-right">
              <span className="text-sm sm:text-base text-white/90">{filteredProducts.length} results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Utility Row */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
        <div className="container">
          <div className="flex items-center gap-3 py-3">
            <button
              aria-label="Open filters"
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              aria-label="Sort products"
              onClick={() => setIsSortOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
            >
              <span>Sort</span>
            </button>
            <button
              aria-label="Search products"
              onClick={() => setIsSearchOpen((s) => !s)}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
          {isSearchOpen && (
            <div className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
          {/* Active filter chips */}
          {(selectedCategory !== 'all' || (searchTerm && searchTerm.trim() !== '')) && (
            <div className="flex flex-wrap items-center gap-2 pb-3">
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs"
                >
                  {formatCategory(selectedCategory)}
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchTerm && searchTerm.trim() !== '' && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs"
                >
                  “{searchTerm}”
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="ml-auto text-xs text-red-600 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-6 sm:py-8">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-xl bg-gray-200" />
                  <div className="h-3 bg-gray-200 rounded mt-3 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <Link href={`/product/${product.slug || product.id}`} key={product.id} className="product-card group">
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-t-xl">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || ''}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority={false}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentImage = product.images[0];
                          const imageUrl = typeof currentImage === 'string' ? currentImage : currentImage?.url || '';
                          
                          if (imageUrl && product.images.length > 1) {
                            // Try next image in array
                            const currentIndex = product.images.findIndex((img: any) => {
                              const imgUrl = typeof img === 'string' ? img : img?.url || '';
                              return imgUrl === target.src;
                            });
                            const nextIndex = (currentIndex + 1) % product.images.length;
                            const nextImage = product.images[nextIndex];
                            target.src = typeof nextImage === 'string' ? nextImage : nextImage?.url || '';
                          } else {
                            // Show placeholder
                            target.style.display = 'none';
                            const placeholder = target.parentElement?.querySelector('.image-placeholder');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    
                    {/* Placeholder for missing images */}
                    {(!product.images || product.images.length === 0) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Fallback placeholder (hidden by default) */}
                    <div className="image-placeholder absolute inset-0 hidden items-center justify-center bg-gray-200">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:bg-red-50 hover:shadow-lg"
                    >
                      <Heart className={`w-4 h-4 ${wishlistItems.has(product.id) ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
                    </button>

                    {/* Share Button (card) */}
                    <div className="absolute top-3 left-3">
                      <ShareMenu url={`/product/${product.slug || product.id}`} title={product.name} description={product.description} />
                    </div>
                    
                    {/* Quick Add to Cart (desktop hover) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="hidden sm:inline-flex absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      Quick Add
                    </button>
                  </div>

                  {/* Product Content */}
                  <div className="product-card__content">
                    {/* Category Badge */}
                    <div className="text-[10px] sm:text-xs font-medium text-red-600 uppercase tracking-wider mb-1 sm:mb-2">
                      {product.category}
                    </div>
                    
                    <h3 className="product-card__title line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                    <p className="hidden sm:block text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="hidden sm:flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{product.rating || 0}</span>
                      <span className="text-sm text-gray-500">({product.reviews || 0})</span>
                    </div>
                    
                    <div className="product-card__price text-sm sm:text-base">₹{product.price.toLocaleString()}</div>
                    
                    <div className="product-card__actions">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 flex-1"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-white rounded-t-2xl sm:rounded-none sm:right-0 sm:top-0 sm:bottom-0 sm:w-96 sm:ml-auto shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-base font-semibold">Filters</h3>
              <button aria-label="Close filters" onClick={() => setIsFilterOpen(false)} className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 rounded border text-sm ${selectedCategory === category ? 'bg-red-50 border-red-300 text-red-700' : 'border-gray-300 text-gray-700'}`}
                    >
                      {formatCategory(category)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium flex-1"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium flex-1"
              >
                Show results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Sheet */}
      {isSortOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsSortOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-base font-semibold">Sort by</h3>
              <button aria-label="Close sort" onClick={() => setIsSortOpen(false)} className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              {[
                { key: 'name', label: 'Name' },
                { key: 'price', label: 'Price' },
                { key: 'rating', label: 'Rating' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSortBy(opt.key);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm rounded ${sortBy === opt.key ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 