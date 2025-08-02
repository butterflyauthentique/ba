# 🔥 Firestore Database Setup Guide

## Overview

This guide will help you set up the Firestore database for Butterfly Authentique with a Shopify-style e-commerce structure.

## 🚀 Quick Start

### 1. Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create New Project**: 
   - Project ID: `butterflyauthentique`
   - Project Name: "Butterfly Authentique"
3. **Enable Firestore Database**:
   - Go to Firestore Database
   - Click "Create Database"
   - Choose "Start in test mode" (we'll secure it later)
   - Select a location (preferably `asia-south1` for India)

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=butterflyauthentique.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=butterflyauthentique
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=butterflyauthentique.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Initialize Database

Run the database initialization script:

```bash
# Install dependencies if not already installed
npm install

# Run the database initialization script
node scripts/init-database.js
```

## 📊 Database Structure

### Collections Overview

```
Firestore Collections:
├── users/           # User accounts and profiles
├── products/        # Product catalog (Shopify-style)
├── categories/      # Product categories and subcategories
├── orders/          # Customer orders
├── cart/           # Shopping cart data
├── blog/           # Blog posts and content
├── reviews/        # Product reviews and ratings
├── addresses/      # Customer addresses
└── settings/       # Store configuration
```

### Products Collection (Shopify-Style)

Each product document contains:

```typescript
{
  // Basic Information
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number; // For discounts
  costPrice: number;
  sku: string;
  barcode?: string;
  
  // Categories & Organization
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  tags: string[];
  vendor: string;
  productType: string;
  
  // Inventory & Shipping
  stock: number;
  lowStockThreshold: number;
  weight: string;
  dimensions: string;
  shippingClass: string;
  
  // Media & Content
  images: string[];
  videos: string[];
  featuredImage: string;
  
  // Variants (Shopify-style)
  variants: Array<{
    id: string;
    name: string;
    price: number;
    comparePrice?: number;
    sku: string;
    stock: number;
    weight: string;
    inStock: boolean;
  }>;
  
  // Status & Settings
  isActive: boolean;
  isFeatured: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  
  // SEO & Marketing
  slug: string;
  metaTitle: string;
  metaDescription: string;
  badges: string[]; // Product badges for attention
  
  // Additional Details
  materials: string;
  artist: string;
  careInstructions: string;
  warranty: string;
  
  // Analytics
  rating: number;
  reviews: number;
  viewCount: number;
  purchaseCount: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'inactive' | 'draft';
}
```

### Categories Collection

```typescript
{
  name: string;
  description: string;
  slug: string;
  parentId?: string; // For subcategories
  level: number; // 1 for main, 2 for sub
  order: number;
  isActive: boolean;
  productCount: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🛡️ Security Rules

### Firestore Security Rules

Create these security rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Products - public read, admin write
    match /products/{productId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Categories - public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Orders - users can read/write their own, admin can read all
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.role == 'admin');
    }
    
    // Cart - users can read/write their own
    match /cart/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Settings - admin only
    match /settings/{settingId} {
      allow read: if true; // Public read for store settings
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Reviews - public read, authenticated users can write
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔐 Authentication Setup

### 1. Enable Authentication

1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable Email/Password authentication
4. Add your admin email: `butterfly.auth@gmail.com`

### 2. Create Admin User

The initialization script will create an admin user, but you can also create one manually:

```javascript
// In Firebase Console > Authentication > Users
Email: butterfly.auth@gmail.com
Password: [your-secure-password]
```

## 📱 Admin Panel Features

### Shopify-Style Product Management

The admin panel includes these Shopify-inspired features:

1. **Product Badges**: 
   - Bestseller, New Arrival, Limited Edition
   - Staff Pick, Award Winning, Fast Selling
   - Only X Left, Sale, Free Shipping, Handmade

2. **Comprehensive Product Data**:
   - Basic Information (name, description, category)
   - Pricing & Inventory (price, compare price, stock)
   - Media & Content (images, videos, care instructions)
   - Variants (sizes, colors, SKUs)
   - Shipping & Tax settings
   - SEO & Marketing (meta tags, slugs)
   - Product badges for attention

3. **Inventory Management**:
   - Stock tracking
   - Low stock alerts
   - Variant management
   - SKU generation

4. **SEO Optimization**:
   - Meta titles and descriptions
   - URL slugs
   - Product tags
   - Category organization

## 🚀 Deployment

### 1. Build and Deploy

```bash
# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### 2. Environment Variables in Production

Set the environment variables in your hosting platform (Firebase Hosting, Vercel, etc.)

## 📈 Analytics & Monitoring

### Firestore Usage Monitoring

1. Go to Firebase Console > Usage and billing
2. Monitor Firestore read/write operations
3. Set up alerts for high usage

### Performance Optimization

1. **Indexes**: Create composite indexes for complex queries
2. **Pagination**: Implement cursor-based pagination for large datasets
3. **Caching**: Use client-side caching for frequently accessed data

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**: Check Firestore security rules
2. **Missing Environment Variables**: Verify `.env.local` file
3. **Database Connection**: Ensure Firebase project ID is correct

### Debug Commands

```bash
# Check Firebase configuration
firebase projects:list

# View Firestore data
firebase firestore:get /products

# Test database connection
node -e "require('./src/lib/firebase.js')"
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Shopify Product Page Guide](https://getmason.io/blog/post/how-to-create-an-effective-shopify-product-page/)

## 🎯 Next Steps

1. ✅ Set up Firebase project
2. ✅ Initialize database with sample data
3. ✅ Configure security rules
4. ✅ Test admin panel functionality
5. 🔄 Add real product data
6. 🔄 Implement payment integration (Razorpay)
7. 🔄 Set up analytics and monitoring

---

**Need Help?** Check the Firebase Console logs or contact the development team. 