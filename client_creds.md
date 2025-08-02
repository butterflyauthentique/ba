# Client Credentials & Configuration - Butterfly Authentique

## 🔐 Required Credentials for Implementation

This file contains all the credentials, API keys, and configuration details needed for the Butterfly Authentique e-commerce platform. We'll fill this in together step by step.

---

## 1. Firebase Configuration

### Firebase Project Setup
- **Project Name**: `butterfly-authentique`
- **Project ID**: `butterflyauthentique33`

### Firebase Web App Configuration
```javascript
// Firebase Config Object (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBTZwEHiG_KmjmZY1wXW3Xane8F4pUqq_E",
  authDomain: "butterflyauthentique33.firebaseapp.com",
  projectId: "butterflyauthentique33",
  storageBucket: "butterflyauthentique33.firebasestorage.app",
  messagingSenderId: "147808797895",
  appId: "1:147808797895:web:5013c06442c7063f796ae2",
  measurementId: "G-KZCWPPK4G3" // Optional for Analytics
};
```

**Required from Firebase Console:**
- [x] Create Firebase Project
- [x] Enable Authentication (Email/Password, Google)
- [ ] Enable Firestore Database
- [x] Enable Storage
- [x] Enable Hosting
- [ ] Enable Cloud Functions (if needed)
- [x] Get Web App Configuration

### Firebase Service Account (for Admin Functions)
```json
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@YOUR_PROJECT_ID.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40YOUR_PROJECT_ID.iam.gserviceaccount.com"
}
```

**Required from Firebase Console:**
- [ ] Go to Project Settings > Service Accounts
- [ ] Generate new private key
- [ ] Download JSON file

---

## 2. Razorpay Payment Gateway

### Razorpay Account Setup
- **Account Type**: Business Account
- **Business Name**: Butterfly Authentique
- **Business Category**: Fashion & Apparel

### Razorpay API Keys
```javascript
// Razorpay Configuration
const razorpayConfig = {
  keyId: "rzp_live_AaXoLwVs0isbmk", // Production Key
keySecret: "07tAIwsgvSam2leJPhNA74tR",   // Production Secret
  // For Production:
  // keyId: "rzp_live_YOUR_KEY_ID",
  // keySecret: "YOUR_LIVE_KEY_SECRET"
};
```

**Required from Razorpay Dashboard:**
- [x] Create Razorpay Business Account
- [x] Get API Keys (Test & Live)
- [x] Configure Webhook URL: `https://dashboard.razorpay.com/app/webhooks/ONOdQWM0efXTZG`
- [ ] Enable Payment Methods: Cards, UPI, Net Banking, Wallets
- [ ] Set up Refund Policy

### Razorpay Webhook Secret
```javascript
const webhookSecret = "ONOdQWM0efXTZG";
```

---

## 3. Email Service Configuration

### React Email Setup (Recommended)
```javascript
// Email Configuration
const emailConfig = {
  fromEmail: "noreply@butterflyauthentique.com",
  fromName: "Butterfly Authentique",
  replyTo: "support@butterflyauthentique.com"
};
```

### SMTP Configuration (Alternative)
```javascript
const smtpConfig = {
  host: "smtp.gmail.com", // or your SMTP provider
  port: 587,
  secure: false,
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD" // Use App Password, not regular password
  }
};
```

**Required:**
- [ ] Set up business email domain
- [ ] Configure SMTP settings
- [ ] Create email templates for:
  - Order confirmation
  - Shipping updates
  - Password reset
  - Welcome emails

---

## 4. Domain & Hosting Configuration

### Custom Domain Setup
- **Primary Domain**: `butterflyauthentique.com` (to be purchased)
- **Subdomain**: `www.butterflyauthentique.com`
- **Admin Subdomain**: `admin.butterflyauthentique.com` (optional)
- **Firebase Hosting URL**: `https://butterflyauthentique33.web.app` (temporary)

### DNS Configuration
```bash
# Firebase Hosting DNS Records
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195

Type: CNAME
Name: www
Value: your-project-id.web.app
```

**Required:**
- [ ] Purchase domain name (butterflyauthentique.com)
- [ ] Configure DNS records
- [ ] Set up SSL certificate (Firebase handles this)
- [x] Configure Firebase Hosting custom domain
- [x] GitHub integration for automatic deployments

---

## 5. Google Services

### Google Analytics 4
```javascript
// Google Analytics Configuration
const gaConfig = {
  measurementId: "G-XXXXXXXXXX",
  apiSecret: "YOUR_API_SECRET"
};
```

**Required from Google Analytics:**
- [ ] Create GA4 Property
- [ ] Get Measurement ID
- [ ] Set up E-commerce tracking
- [ ] Configure conversion goals

### Google Search Console
```javascript
// Search Console Verification
const searchConsoleConfig = {
  verificationCode: "YOUR_VERIFICATION_CODE"
};
```

**Required:**
- [ ] Add domain to Search Console
- [ ] Verify ownership
- [ ] Submit sitemap
- [ ] Monitor indexing

### Google Fonts
```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap');
```

---

## 6. Image & Media Storage

### Cloudinary (Alternative to Firebase Storage)
```javascript
// Cloudinary Configuration
const cloudinaryConfig = {
  cloudName: "YOUR_CLOUD_NAME",
  apiKey: "YOUR_API_KEY",
  apiSecret: "YOUR_API_SECRET",
  uploadPreset: "butterfly_authentique"
};
```

**Required from Cloudinary:**
- [ ] Create Cloudinary account
- [ ] Get API credentials
- [ ] Set up upload presets
- [ ] Configure image transformations

---

## 7. Monitoring & Analytics

### Sentry Error Tracking
```javascript
// Sentry Configuration
const sentryConfig = {
  dsn: "https://YOUR_SENTRY_DSN@xxxxx.ingest.sentry.io/xxxxx",
  environment: "production"
};
```

**Required from Sentry:**
- [ ] Create Sentry project
- [ ] Get DSN
- [ ] Configure error tracking
- [ ] Set up performance monitoring

### Performance Monitoring
```javascript
// Core Web Vitals Monitoring
const performanceConfig = {
  enableAnalytics: true,
  enablePerformance: true,
  enableRealUserMonitoring: true
};
```

---

## 8. Security & Environment Variables

### Environment Variables (.env.local)
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBTZwEHiG_KmjmZY1wXW3Xane8F4pUqq_E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=butterflyauthentique33.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=butterflyauthentique33
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=butterflyauthentique33.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=147808797895
NEXT_PUBLIC_FIREBASE_APP_ID=1:147808797895:web:5013c06442c7063f796ae2

# Razorpay
RAZORPAY_KEY_ID=rzp_live_AaXoLwVs0isbmk
RAZORPAY_KEY_SECRET=07tAIwsgvSam2leJPhNA74tR
RAZORPAY_WEBHOOK_SECRET=ONOdQWM0efXTZG

# Email
EMAIL_FROM=noreply@butterflyauthentique.com
EMAIL_REPLY_TO=support@butterflyauthentique.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your_ga_api_secret

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://butterflyauthentique.com
NEXT_PUBLIC_APP_NAME=Butterfly Authentique
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## 9. Scalability Configuration

### CDN & Performance
```javascript
// CDN Configuration
const cdnConfig = {
  imageOptimization: true,
  compression: true,
  caching: {
    static: "1 year",
    images: "1 month",
    api: "5 minutes"
  }
};
```

### Database Optimization
```javascript
// Firestore Indexes
const requiredIndexes = [
  "products: categoryId, isActive, price",
  "products: isFeatured, createdAt",
  "orders: userId, createdAt",
  "orders: status, paymentStatus",
  "blog: status, publishedAt",
  "reviews: productId, rating"
];
```

### Caching Strategy
```javascript
// Redis Configuration (for future scaling)
const redisConfig = {
  host: "localhost", // or Redis Cloud URL
  port: 6379,
  password: "your_redis_password",
  db: 0
};
```

---

## 10. Legal & Compliance

### Privacy Policy & Terms
- [ ] Privacy Policy URL: `https://butterflyauthentique.com/privacy`
- [ ] Terms of Service URL: `https://butterflyauthentique.com/terms`
- [ ] Refund Policy URL: `https://butterflyauthentique.com/refund-policy`
- [ ] Shipping Policy URL: `https://butterflyauthentique.com/shipping-policy`

### GDPR Compliance
```javascript
// Cookie Consent Configuration
const cookieConfig = {
  enableAnalytics: true,
  enableMarketing: false,
  enableNecessary: true,
  cookiePolicy: "https://butterflyauthentique.com/cookie-policy"
};
```

---

## 11. Business Information

### Company Details
```javascript
const businessInfo = {
  name: "Butterfly Authentique",
  legalName: "Butterfly Authentique Private Limited",
  address: {
    street: "Your Business Address",
    city: "Your City",
    state: "Your State",
    postalCode: "Your Postal Code",
    country: "India"
  },
  contact: {
    email: "hello@butterflyauthentique.com",
    phone: "+91-XXXXXXXXXX",
    whatsapp: "+91-XXXXXXXXXX"
  },
  taxInfo: {
    gstNumber: "Your GST Number",
    panNumber: "Your PAN Number"
  },
  bankDetails: {
    accountNumber: "Your Account Number",
    ifscCode: "Your IFSC Code",
    bankName: "Your Bank Name"
  }
};
```

### Social Media
```javascript
const socialMedia = {
  instagram: "https://instagram.com/butterflyauthentique",
  facebook: "https://facebook.com/butterflyauthentique",
  twitter: "https://twitter.com/butterflyauth",
  youtube: "https://youtube.com/@butterflyauthentique",
  pinterest: "https://pinterest.com/butterflyauthentique"
};
```
### Git token
``` git token = [REMOVED_FOR_SECURITY] ```
---

## 📋 Implementation Checklist

### Phase 1: Setup & Configuration
- [ ] Firebase project creation and configuration
- [ ] Razorpay account setup and API keys
- [ ] Domain purchase and DNS configuration
- [ ] Environment variables setup
- [ ] Google Analytics and Search Console setup

### Phase 2: Development
- [ ] Next.js project initialization
- [ ] Firebase integration
- [ ] Payment gateway integration
- [ ] Email service setup
- [ ] Admin dashboard development

### Phase 3: Testing & Deployment
- [ ] Local development and testing
- [ ] Staging environment setup
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Security audit

### Phase 4: Launch & Monitoring
- [ ] Go-live checklist
- [ ] Monitoring setup
- [ ] Backup procedures
- [ ] Maintenance schedule

---

## 🔒 Security Notes

1. **Never commit credentials to Git** - Use environment variables
2. **Use strong, unique passwords** for all services
3. **Enable 2FA** on all accounts
4. **Regular security audits** and updates
5. **Backup all configurations** securely
6. **Monitor for suspicious activity**

---

## 📞 Support Contacts

- **Firebase Support**: https://firebase.google.com/support
- **Razorpay Support**: support@razorpay.com
- **Domain Provider**: Your domain registrar support
- **Email Provider**: Your email service support

---

**⚠️ Important**: Please provide the credentials one by one, and I'll update this file accordingly. Keep this file secure and never share it publicly.

**Ready to start configuring!** Let's begin with the first service. Which one would you like to start with? 