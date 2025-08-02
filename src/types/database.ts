import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  
  // Profile information
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    newsletter: boolean;
    marketing: boolean;
    categories: string[];
  };
  
  // Social login
  provider?: 'email' | 'google' | 'facebook';
  providerId?: string;
}

// Address Types
export interface Address {
  id: string;
  type: 'shipping' | 'billing' | 'both';
  isDefault: boolean;
  
  // Address details
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string; // For subcategories
  level: number; // 1 for main, 2 for sub
  order: number;
  isActive: boolean;
  
  // Images
  image?: string;
  icon?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Analytics
  productCount: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Product Types
export interface Product {
  id: string; // Auto-generated Firestore ID
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number; // For discounts
  costPrice: number;
  sku: string;
  barcode?: string;
  
  // Categories
  category: string;
  subcategory?: string;
  tags: string[];
  
  // Vendor & Product Type
  vendor?: string;
  productType?: string;
  
  // Inventory
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  
  // Physical Properties
  weight?: string;
  dimensions?: string;
  shippingClass?: string;
  
  // Images
  images: {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
  }[];
  
  // Variants (for different sizes, colors, etc.)
  variants?: {
    id: string;
    name: string;
    price: number;
    stock: number;
    sku: string;
  }[];
  
  // Shipping & Tax
  requiresShipping?: boolean;
  isTaxable?: boolean;
  
  // SEO & URLs
  slug: string; // SEO-friendly URL slug (e.g., "krishna-playing-flute-divine-melody")
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  
  // Product Details
  materials?: string;
  artist?: string;
  careInstructions?: string;
  warranty?: string;
  badges?: string[];
  
  // Analytics
  viewCount: number;
  purchaseCount: number;
  rating?: number;
  reviews?: number;
  
  // Status
  status?: 'active' | 'inactive' | 'draft';
  
  // Social sharing
  socialImage?: string; // Specific image for social sharing
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string; // Human-readable: BA-2024-001
  userId: string;
  
  // Customer information
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  
  // Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  
  // Payment
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  transactionId?: string;
  
  // Shipping
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod: 'standard' | 'express';
  trackingNumber?: string;
  
  // Status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  statusHistory: {
    status: string;
    timestamp: Timestamp;
    note?: string;
  }[];
  
  // Notes
  customerNotes?: string;
  adminNotes?: string;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
}

// Order Item Types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  
  // Pricing
  price: number;
  quantity: number;
  total: number;
  
  // Variants
  variantId?: string;
  variantName?: string;
  
  // Status
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  
  createdAt: Timestamp;
}

// Cart Types
export interface Cart {
  id: string; // User ID
  userId: string;
  
  items: {
    productId: string;
    quantity: number;
    addedAt: Timestamp;
    variantId?: string;
  }[];
  
  // Calculated totals
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  
  // Coupon
  couponCode?: string;
  discount: number;
  
  updatedAt: Timestamp;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  
  // Author
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  
  // Images
  featuredImage?: string;
  images?: string[];
  
  // Categories and tags
  category: string;
  tags: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  
  // Analytics
  viewCount: number;
  readTime: number; // in minutes
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId?: string; // To verify purchase
  
  // Rating and content
  rating: number; // 1-5 stars
  title?: string;
  comment: string;
  
  // Images
  images?: string[];
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  
  // Helpful votes
  helpfulVotes: number;
  totalVotes: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// SMTP Settings Type
export interface SMTPSettings {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Settings Types
export interface Settings {
  id: string; // Document ID
  type: 'general' | 'payment' | 'shipping' | 'email' | 'seo';
  
  // General settings
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  
  // Contact information
  contactEmail: string;
  contactPhone?: string;
  address?: Address;
  
  // Social media
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // Payment settings
  currency: string;
  taxRate: number;
  
  // Shipping settings
  freeShippingThreshold: number;
  shippingRates: {
    standard: number;
    express: number;
  };
  
  // Email settings
  emailSettings: {
    fromEmail: string;
    fromName: string;
    smtpSettings?: SMTPSettings;
  };
  
  updatedAt: Timestamp;
  updatedBy: string;
} 

// Wishlist Types
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  productSlug: string;
  productCategory: string;
  addedAt: Timestamp;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  isPublic?: boolean;
  originalPrice?: number; // For price tracking
  lastPriceCheck?: Timestamp;
} 