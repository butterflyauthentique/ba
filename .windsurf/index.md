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
- Staging: Automatic on `staging` branch
- Production: Manual deployment from `main` branch
