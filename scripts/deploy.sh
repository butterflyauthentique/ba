#!/bin/bash

# Butterfly Authentique - Deployment Script
# This script handles deployment and reminds about the Cloud Function authentication fix

set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: firebase.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Error: Firebase CLI not found. Please install it first: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Error: Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

echo "✅ Pre-deployment checks passed"

# Stop local development server if running
echo "🛑 Stopping local development server..."
pkill -f "next dev" || true
sleep 2

# Clean Next.js cache to prevent conflicts
echo "🧹 Cleaning Next.js cache..."
rm -rf .next
rm -rf out

# Deploy to Firebase
echo "📦 Deploying to Firebase..."
firebase deploy --only hosting

echo ""
echo "🎉 Deployment completed!"
echo ""

# Restart local development server
echo "🔄 Restarting local development server..."
echo "💡 Run 'npm run dev' in a new terminal to start local development"
echo ""

echo "⚠️  IMPORTANT: If you see 403 errors on product pages, you need to fix the Cloud Function authentication:"
echo ""
echo "🔧 Quick Fix (Google Cloud Console):"
echo "1. Go to: https://console.cloud.google.com/functions/list?project=butterflyauthentique33"
echo "2. Find function: ssrbutterflyauthentique"
echo "3. Click on the function name"
echo "4. Go to 'Permissions' tab"
echo "5. Click 'Add Principal'"
echo "6. Add 'allUsers' with role 'Cloud Functions Invoker'"
echo "7. Save changes"
echo ""
echo "🔧 Alternative Fix (Firebase Console):"
echo "1. Go to: https://console.firebase.google.com/project/butterflyauthentique33/functions"
echo "2. Find function: ssrbutterflyauthentique"
echo "3. Click on the function name"
echo "4. Go to 'Permissions' tab"
echo "5. Add member: 'allUsers' with role 'Cloud Functions Invoker'"
echo ""
echo "🧪 Test your deployment:"
echo "curl -I https://butterflyauthentique33.web.app/product/diego-rivera-inspired-flower-seller-replica-hand-painted-acrylic-on-canvas-mexican-art-"
echo ""
echo "📚 For more details, see: DEPLOYMENT_WORKFLOW.md" 