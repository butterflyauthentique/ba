# Database Design - Butterfly Authentique

## 1. Database Overview

### Technology Choice: Firebase Firestore
- **NoSQL Document Database**: Flexible schema for e-commerce data
- **Real-time Updates**: Live data synchronization
- **Scalability**: Automatic scaling with traffic
- **Security**: Built-in security rules
- **Offline Support**: Client-side caching

### Database Structure
```
Firestore Collections:
├── users
├── products
├── categories
├── orders
├── orderItems
├── cart
├── blog
├── reviews
├── addresses
└── settings
```

## 2. Collection Schemas

### Users Collection
```typescript
interface User {
  id: string; // Auto-generated
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
  
  // Addresses (subcollection)
  addresses?: Address[];
  
  // Social login
  provider?: 'email' | 'google' | 'facebook';
  providerId?: string;
}
```

**Indexes:**
- `email` (unique)
- `role`
- `isActive`
- `createdAt`

### Products Collection
```typescript
interface Product {
  id: string; // Auto-generated
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number; // For discounts
  costPrice: number;
  sku: string;
  barcode?: string;
  
  // Categories
  categoryId: string;
  subcategoryId?: string;
  tags: string[];
  
  // Inventory
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  
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
  
  // SEO
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  
  // Analytics
  viewCount: number;
  purchaseCount: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}
```

**Indexes:**
- `categoryId`
- `isActive`
- `isFeatured`
- `price`
- `stock`
- `createdAt`
- `slug` (unique)

### Categories Collection
```typescript
interface Category {
  id: string; // Auto-generated
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
```

**Indexes:**
- `parentId`
- `level`
- `isActive`
- `order`
- `slug` (unique)

### Orders Collection
```typescript
interface Order {
  id: string; // Auto-generated
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
```

**Indexes:**
- `userId`
- `orderNumber` (unique)
- `status`
- `paymentStatus`
- `createdAt`
- `customer.email`

### OrderItems Collection (Subcollection)
```typescript
interface OrderItem {
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
```

### Cart Collection (User-specific)
```typescript
interface Cart {
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
```

### Blog Collection
```typescript
interface BlogPost {
  id: string; // Auto-generated
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
```

**Indexes:**
- `authorId`
- `status`
- `category`
- `publishedAt`
- `slug` (unique)

### Reviews Collection
```typescript
interface Review {
  id: string; // Auto-generated
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
```

**Indexes:**
- `productId`
- `userId`
- `rating`
- `status`
- `createdAt`

### Addresses Collection (User subcollection)
```typescript
interface Address {
  id: string; // Auto-generated
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
```

### Settings Collection
```typescript
interface Settings {
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
    smtpSettings?: any;
  };
  
  updatedAt: Timestamp;
  updatedBy: string;
}
```

## 3. Security Rules

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products are readable by all, writable by admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders are readable by owner and admins
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Cart is user-specific
    match /cart/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Blog posts are readable by all, writable by admins
    match /blog/{postId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 4. Data Relationships

### One-to-Many Relationships
- User → Orders
- User → Reviews
- Category → Products
- Product → Reviews
- Product → OrderItems

### Many-to-Many Relationships
- Products ↔ Tags (implemented as arrays)
- Blog Posts ↔ Tags (implemented as arrays)

### Subcollections
- Users → Addresses
- Orders → OrderItems

## 5. Data Validation

### Client-Side Validation
```typescript
// Using Zod for schema validation
const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  // ... other fields
});
```

### Server-Side Validation
- Firebase Functions for complex validation
- Firestore triggers for data integrity
- Custom validation functions

## 6. Data Migration Strategy

### Version Control
- Schema versioning in settings
- Migration scripts for schema changes
- Backward compatibility considerations

### Data Backup
- Daily automated backups
- Point-in-time recovery
- Cross-region replication

## 7. Performance Optimization

### Indexing Strategy
- Composite indexes for complex queries
- Single-field indexes for filtering
- Array-contains queries for tags

### Query Optimization
- Limit result sets
- Use pagination
- Cache frequently accessed data
- Optimize for common use cases

### Data Denormalization
- Store calculated fields (totals, counts)
- Embed frequently accessed data
- Balance between performance and consistency 