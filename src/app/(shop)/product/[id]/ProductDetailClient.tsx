'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Package,
  User,
  Calendar,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useHydratedStore } from '@/lib/store';
import { WishlistService } from '@/lib/services/wishlistService';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Product } from '@/types/database';

interface ProductVariant {
  name: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stock?: number;
  weight?: string;
  inStock: boolean;
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useHydratedStore();
  const { user } = useAuth();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const availableStock = selectedVariant?.stock ?? product.stock;
  const isOutOfStock = availableStock <= 0;

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showShareMenu && !target.closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Check if product is in wishlist (only if user is logged in)
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) {
        setIsInWishlist(false);
        return;
      }
      
      try {
        const inWishlist = await WishlistService.isInWishlist(user.id, product.id);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        // Don't fail the page if wishlist check fails
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [user, product.id]);

  useEffect(() => {
    // Set first variant as default if available
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant({
        ...firstVariant,
        inStock: (firstVariant.stock ?? 0) > 0,
      });
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  // Reset quantity to 1 if it exceeds the available stock of the newly selected variant
  useEffect(() => {
    if (quantity > availableStock) {
      setQuantity(1);
    }
  }, [availableStock, quantity]);

  const handleAddToCart = () => {
    const variantId = selectedVariant?.name || 'default';
    addToCart({
      productId: product.id,
      variantId: variantId !== 'default' ? variantId : undefined,
      quantity,
      price: selectedVariant?.price || product.price,
      name: product.name,
      image: typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url || ''
    });
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      return;
    }

    try {
      const result = await WishlistService.toggleWishlistItem(user.id, product);
      setIsInWishlist(result.added);
      toast.success(result.added ? 'Added to wishlist!' : 'Removed from wishlist');
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
      // Don't fail the page if wishlist operation fails
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Social Sharing Functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = product.name;
  const shareDescription = product.metaDescription || product.description || `Check out this beautiful ${product.name} from Butterfly Authentique!`;
  const shareImage = (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url);

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const text = `${shareTitle} - ${shareDescription.substring(0, 100)}...`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we'll copy the link
    copyToClipboard();
    toast.success('Link copied! You can now paste it in your Instagram story or post.');
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const text = `${shareTitle} - ${shareDescription.substring(0, 100)}...\n\nCheck it out: ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  const shareViaEmail = () => {
    const subject = `Check out this beautiful ${product.name}`;
    const body = `I found this amazing product and thought you might like it!\n\n${shareTitle}\n${shareDescription}\n\nView it here: ${shareUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const currentPrice = selectedVariant?.price || product.price;
  const comparePrice = selectedVariant?.comparePrice || product.comparePrice;
  const isOnSale = comparePrice && comparePrice > currentPrice;
  const discountPercentage = isOnSale ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100) : 0;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
            "image": (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url),
    "brand": {
      "@type": "Brand",
      "name": "Butterfly Authentique"
    },
    "offers": {
      "@type": "Offer",
      "price": currentPrice,
      "priceCurrency": "INR",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "seller": {
        "@type": "Organization",
        "name": "Butterfly Authentique"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews
    },
    "category": product.category,
    "material": product.materials,
    "artist": product.artist,
    "sku": product.sku,
    "mpn": product.id
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-red-600 transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-red-600 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <div className="aspect-square relative">
                {product.images && product.images.length > 0 ? (
                  <>
                    <Image
                                              src={typeof product.images[selectedImageIndex] === 'string' ? product.images[selectedImageIndex] : product.images[selectedImageIndex]?.url || ''}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      priority={true}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (product.images.length > 1) {
                          const currentIndex = product.images.findIndex((img: any) => 
                            (typeof img === 'string' ? img : img?.url) === target.src
                          );
                          const nextIndex = (currentIndex + 1) % product.images.length;
                                                      const nextImage = product.images[nextIndex];
                            const nextImageUrl = typeof nextImage === 'string' ? nextImage : nextImage?.url || '';
                          target.src = typeof nextImage === 'string' ? nextImage : nextImage?.url;
                        } else {
                          target.style.display = 'none';
                          const placeholder = target.parentElement?.querySelector('.main-image-placeholder');
                          if (placeholder) {
                            (placeholder as HTMLElement).style.display = 'flex';
                          }
                        }
                      }}
                    />
                    
                    <div className="main-image-placeholder absolute inset-0 hidden items-center justify-center bg-gray-100">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                    
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
                        {selectedImageIndex + 1} / {product.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 bg-white ${
                      selectedImageIndex === index 
                        ? 'border-red-600 shadow-md ring-2 ring-red-100' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    aria-label={`View image ${index + 1} of ${product.images.length}`}
                  >
                    <Image
                      src={typeof image === 'string' ? image : image?.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 10vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.parentElement?.querySelector('.thumb-placeholder');
                        if (placeholder) {
                          (placeholder as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="thumb-placeholder absolute inset-0 hidden items-center justify-center bg-gray-100">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Category and Badges */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-red-600 uppercase tracking-wider">
                {product.category}
              </span>
              {product.badges && product.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Product Title */}
            <h1 className="font-secondary text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Artist Information */}
            {product.artist && (
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span>By {product.artist}</span>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{comparePrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              {product.sku && (
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Select Option</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantSelect({ ...variant, inStock: true })}
                      className={`p-3 border-2 rounded-lg text-left transition-colors ${
                        selectedVariant?.name === variant.name
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{variant.name}</div>
                      <div className="text-sm text-gray-600">
                        ₹{variant.price.toLocaleString()}
                      </div>
                      {('inStock' in variant ? variant.inStock === false : variant.stock === 0) && (
                        <div className="text-xs text-red-600">Out of Stock</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-800">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1.5 text-lg font-semibold text-gray-900 w-16 text-center tabular-nums">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isOutOfStock || quantity >= availableStock}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {!isOutOfStock ? (
                <span className="text-sm text-gray-600">
                  Only <span className="font-bold text-red-600">{availableStock}</span> left in stock!
                </span>
              ) : (
                <span className="text-sm font-bold text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex items-stretch gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`p-3 border rounded-md shadow-sm transition-colors ${isInWishlist ? 'bg-red-100 border-red-200 text-red-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              {/* Share Button */}
              <div className="relative share-menu-container">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                
                {/* Share Menu Dropdown */}
                {showShareMenu && (
                  <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Share this product</h3>
                      <div className="space-y-2">
                        <button
                          onClick={shareToFacebook}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-gray-700">Share on Facebook</span>
                        </button>
                        <button
                          onClick={shareToTwitter}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-gray-700">Share on Twitter</span>
                        </button>
                        <button
                          onClick={shareToInstagram}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Instagram className="w-5 h-5 text-pink-600" />
                          <span className="text-sm text-gray-700">Share on Instagram</span>
                        </button>
                        <button
                          onClick={shareToWhatsApp}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">W</span>
                          </div>
                          <span className="text-sm text-gray-700">Share on WhatsApp</span>
                        </button>
                        <button
                          onClick={shareViaEmail}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">Share via Email</span>
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            {copied ? 'Copied!' : 'Copy link'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              
              {product.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {product.materials && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Materials</h4>
                  <p className="text-gray-600">{product.materials}</p>
                </div>
              )}

              {product.dimensions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
                  <p className="text-gray-600">{product.dimensions}</p>
                </div>
              )}

              {product.weight && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Weight</h4>
                  <p className="text-gray-600">{product.weight}</p>
                </div>
              )}

              {product.careInstructions && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
                  <p className="text-gray-600">{product.careInstructions}</p>
                </div>
              )}

              {product.warranty && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Warranty</h4>
                  <p className="text-gray-600">{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">Free Shipping</div>
                    <div className="text-sm text-gray-600">On orders over ₹2000</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">Secure Payment</div>
                    <div className="text-sm text-gray-600">100% secure checkout</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">Easy Returns</div>
                    <div className="text-sm text-gray-600">30 day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 