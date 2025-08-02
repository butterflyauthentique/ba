# Architecture Overview - Butterfly Authentique

## 1. System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Layer  │    │   Server Layer  │    │  External APIs  │
│                 │    │                 │    │                 │
│  Next.js App    │◄──►│  Firebase       │◄──►│  Razorpay       │
│  (React 19)     │    │  Services       │    │  Payment API    │
│                 │    │                 │    │                 │
│  PWA Support    │    │  Cloud          │    │  Email Service  │
│  Mobile-First   │    │  Functions      │    │  (React Email)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: Next.js 15+ with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, ShadCN UI components
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Payment**: Razorpay integration
- **Deployment**: Firebase Hosting
- **Email**: React Email for transactional emails

## 2. Application Structure

### Next.js App Router Structure
```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (shop)/
│   ├── shop/
│   ├── product/[id]/
│   ├── cart/
│   └── checkout/
├── (admin)/
│   ├── admin/
│   ├── admin/products/
│   ├── admin/orders/
│   └── admin/blog/
├── (marketing)/
│   ├── page.tsx (Home)
│   ├── about/
│   ├── blog/
│   └── contact/
├── api/
│   ├── auth/
│   ├── products/
│   ├── orders/
│   ├── payments/
│   └── webhooks/
├── components/
│   ├── ui/ (ShadCN components)
│   ├── layout/
│   ├── product/
│   ├── cart/
│   └── admin/
├── lib/
│   ├── firebase/
│   ├── utils/
│   ├── validations/
│   └── constants/
└── types/
    ├── product.ts
    ├── order.ts
    ├── user.ts
    └── api.ts
```

## 3. Data Flow Architecture

### User Journey Flow
```
1. User visits site → Next.js serves static pages
2. User browses products → Firestore queries for product data
3. User adds to cart → Zustand state management
4. User proceeds to checkout → Cart validation
5. User makes payment → Razorpay API integration
6. Payment success → Firestore order creation
7. Order confirmation → React Email notification
```

### Authentication Flow
```
1. User clicks login → Firebase Auth UI
2. User enters credentials → Firebase Auth validation
3. Success response → JWT token stored in Zustand
4. Protected routes → Token validation middleware
5. Admin routes → Role-based access control
```

## 4. Firebase Services Integration

### Firestore Database
```typescript
// Collections structure
collections: {
  users: {
    [userId]: {
      email: string;
      name: string;
      role: 'user' | 'admin';
      createdAt: timestamp;
      addresses: Address[];
    }
  },
  products: {
    [productId]: {
      name: string;
      description: string;
      price: number;
      category: 'paintings' | 'stoles' | 'jewelry';
      images: string[];
      stock: number;
      isActive: boolean;
      createdAt: timestamp;
    }
  },
  orders: {
    [orderId]: {
      userId: string;
      products: OrderItem[];
      total: number;
      status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
      paymentId: string;
      shippingAddress: Address;
      createdAt: timestamp;
    }
  },
  blog: {
    [postId]: {
      title: string;
      content: string;
      excerpt: string;
      author: string;
      publishedAt: timestamp;
      tags: string[];
    }
  }
}
```

### Firebase Authentication
- **Email/Password**: Standard authentication
- **Google OAuth**: Social login option
- **Phone Auth**: SMS verification (optional)
- **Custom Claims**: Role-based permissions

### Firebase Storage
- **Product Images**: Optimized image storage
- **Blog Images**: Content media storage
- **User Avatars**: Profile picture storage
- **Security Rules**: Role-based access control

### Firebase Cloud Functions
```typescript
// Serverless functions
functions: {
  processPayment: 'Handle Razorpay webhooks',
  sendOrderEmail: 'Transactional email service',
  updateInventory: 'Stock management',
  generateInvoice: 'PDF generation',
  backupData: 'Daily data backup'
}
```

## 5. API Architecture

### RESTful API Endpoints
```
/api/auth/
├── POST /login
├── POST /register
├── POST /logout
└── GET /me

/api/products/
├── GET / (list products)
├── GET /[id] (product details)
├── POST / (create product - admin)
├── PUT /[id] (update product - admin)
└── DELETE /[id] (delete product - admin)

/api/orders/
├── GET / (user orders)
├── POST / (create order)
├── PUT /[id] (update order status - admin)
└── GET /[id] (order details)

/api/payments/
├── POST /create-intent (Razorpay)
├── POST /confirm (payment confirmation)
└── POST /webhook (Razorpay webhooks)
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
```

## 6. Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: User vs Admin permissions
- **Route Protection**: Middleware for protected routes
- **CSRF Protection**: Cross-site request forgery prevention

### Data Security
- **Firestore Security Rules**: Database-level security
- **Input Validation**: Server-side validation
- **XSS Prevention**: Content Security Policy
- **HTTPS Only**: Secure communication

### Payment Security
- **PCI Compliance**: Secure payment processing
- **Webhook Verification**: Razorpay signature validation
- **Encrypted Data**: Sensitive data encryption
- **Audit Logging**: Payment transaction logs

## 7. Performance Architecture

### Frontend Optimization
- **Static Generation**: Pre-rendered pages for SEO
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Dynamic imports for lazy loading
- **Caching Strategy**: Browser and CDN caching

### Backend Optimization
- **Database Indexing**: Optimized Firestore queries
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis for frequently accessed data
- **CDN Integration**: Global content delivery

### Mobile Performance
- **PWA Features**: Offline support, app-like experience
- **Touch Optimization**: Mobile-first interactions
- **Battery Optimization**: Efficient resource usage
- **Network Optimization**: Minimal data transfer

## 8. Scalability Architecture

### Horizontal Scaling
- **Load Balancing**: Multiple server instances
- **Auto-scaling**: Firebase automatic scaling
- **Database Sharding**: Firestore automatic scaling
- **CDN Distribution**: Global content delivery

### Vertical Scaling
- **Resource Optimization**: Efficient code and queries
- **Memory Management**: Proper cleanup and garbage collection
- **Database Optimization**: Indexed queries and efficient schemas
- **Asset Optimization**: Compressed images and minified code

## 9. Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Error Tracking**: Sentry integration
- **User Analytics**: Google Analytics 4
- **Performance Metrics**: Real User Monitoring

### Business Analytics
- **Conversion Tracking**: E-commerce conversion funnels
- **User Behavior**: Heatmaps and session recordings
- **Revenue Analytics**: Sales and revenue tracking
- **Inventory Analytics**: Stock level monitoring

## 10. Deployment Architecture

### Development Environment
- **Local Development**: Next.js dev server
- **Firebase Emulators**: Local backend services
- **Hot Reloading**: Real-time code updates
- **Environment Variables**: Secure configuration management

### Production Environment
- **Firebase Hosting**: Global CDN deployment
- **Environment Separation**: Dev/Staging/Production
- **CI/CD Pipeline**: Automated deployment
- **Rollback Strategy**: Quick deployment rollbacks

### Backup & Recovery
- **Database Backups**: Daily automated backups
- **Code Versioning**: Git-based version control
- **Disaster Recovery**: Multi-region redundancy
- **Data Retention**: Compliance with data regulations 