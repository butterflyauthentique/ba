# Firestore Database Setup Guide

## The Problem
You're getting `400 (Bad Request)` errors when trying to create products because the **Firestore database hasn't been created yet** in your Firebase project.

## Solution: Create Firestore Database

### Step 1: Go to Firebase Console
1. Open your browser and go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Select your project: `butterflyauthentique33`

### Step 2: Create Firestore Database
1. In the left sidebar, click on **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development - you can secure it later)
4. Select a **location** (choose the closest to your users, e.g., `asia-south1` for India)
5. Click **"Done"**

### Step 3: Wait for Database to Initialize
- The database creation takes a few minutes
- You'll see a loading screen while it's being set up
- Once done, you'll see an empty Firestore database

### Step 4: Test the Connection
1. Go back to your admin panel: http://localhost:3003/admin/products/
2. Click the **"Test Firestore Connection"** button
3. You should see a success message
4. Check the browser console for detailed logs

### Step 5: Try Creating a Product
1. Go to: http://localhost:3003/admin/products/new/
2. Fill in the product details
3. Click "Save Product"
4. It should now work without the 400 errors!

## Alternative: Use the Setup Script

If you prefer, you can also run the setup script:

```bash
# Make sure you're in the project directory
cd /Users/pritinupur/ba_website

# Run the setup script
node scripts/setup-firestore.js
```

This script will:
- Test the Firestore connection
- Create sample collections and data
- Provide detailed error messages if something goes wrong

## Debugging

### Check Environment Variables
Make sure your `.env.local` file has all the required Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=butterflyauthentique33.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=butterflyauthentique33
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=butterflyauthentique33.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_measurement_id
```

### Common Error Messages

1. **"Database not found"** - You need to create the Firestore database
2. **"Permission denied"** - Security rules are too restrictive (use test mode)
3. **"Service unavailable"** - Check your internet connection

### Browser Console Logs
The enhanced debugging will show detailed logs in the browser console:
- 🔍 Connection testing
- 🚀 Product creation process
- ✅ Success messages
- ❌ Error details

## Security Rules (Later)
Once everything is working, you should update the Firestore security rules:

1. Go to Firestore Database in Firebase Console
2. Click on "Rules" tab
3. Replace the test rules with proper security rules
4. Example rules for development:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

## Next Steps
After setting up Firestore:
1. ✅ Create products in admin panel
2. ✅ View products in admin panel
3. ✅ Test the shop page
4. 🔄 Set up proper security rules
5. 🔄 Configure authentication

## Need Help?
If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project settings
3. Make sure the Firestore database is created and accessible
4. Try the setup script for automated testing 