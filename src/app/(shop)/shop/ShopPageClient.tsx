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
  Minus
} from 'lucide-react';
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover unique handcrafted jewelry, stunning paintings, and elegant stoles. 
              Each piece tells a story of artistic excellence and cultural heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option 
                    key={category} 
                    value={category}
                  >
                    {formatCategory(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="text-center py-16">
              <p>Loading products...</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Link href={`/product/${product.slug || product.id}`} key={product.id} className="product-card group">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-t-xl">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || ''}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Heart className={`w-4 h-4 ${wishlistItems.has(product.id) ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
                    </button>
                    
                    {/* Quick Add to Cart */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      Quick Add
                    </button>
                  </div>

                  {/* Product Content */}
                  <div className="product-card__content">
                    {/* Category Badge */}
                    <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2">
                      {product.category}
                    </div>
                    
                    <h3 className="product-card__title line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{product.rating || 0}</span>
                      <span className="text-sm text-gray-500">({product.reviews || 0})</span>
                    </div>
                    
                    <div className="product-card__price">₹{product.price.toLocaleString()}</div>
                    
                    <div className="product-card__actions">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="btn-primary text-sm px-4 py-2 flex-1"
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
    </div>
  );
} 