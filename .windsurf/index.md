# Butterfly Authentique - E-commerce Platform

## Project Overview
Modern e-commerce platform for handcrafted jewelry, paintings, and stoles built with Next.js, Tailwind CSS, and Firebase.

## Technology Stack
- **Frontend**: Next.js 15.4, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Razorpay integration
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation

## Key Features
- Admin dashboard for product management
- User authentication and authorization
- Product catalog with categories
- Shopping cart and checkout flow
- Image upload and management
- Order processing system

## Development Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables
Create `.env.local` with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_RAZORPAY_KEY=
```

## Deployment

### Firebase Deployment
- **Project ID**: `butterflyauthentique33`
- **Admin Email**: `butterfly.auth@gmail.com`
- **Deployment URL**: https://butterflyauthentique33.web.app
- **Deployment Command**: `firebase deploy --only hosting`
- **Last Successful Deployment**: 2025-08-06

### Deployment Process
1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase login:ci
   # Follow the prompts to authenticate with butterfly.auth@gmail.com
   firebase use butterflyauthentique33
   firebase deploy --only hosting
   ```

3. **Verify Deployment**:
   - Visit: https://console.firebase.google.com/project/butterflyauthentique33/hosting
   - Check the deployment history and status

### Environment Setup
1. **Firebase Login**:
   ```bash
   firebase login
   # Use: butterfly.auth@gmail.com
   # Password: **********
   ```

2. **Select Project**:
   ```bash
   firebase use butterflyauthentique33
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Git Integration
- **Repository**: `git@github.com:butterflyauthentique/ba.git`
- **Main Branch**: `main`
- **Staging Branch**: `staging`

### Security Notes
- Never commit credentials to version control
- Store sensitive information in `.env.local` (included in `.gitignore`)
- Use Firebase environment configuration for production secrets
