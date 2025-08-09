#!/bin/bash

# Butterfly Authentique - Production Setup Script
# This script helps set up production environment variables

set -e

echo "🚀 Butterfly Authentique - Production Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if .env.production already exists
if [ -f ".env.production" ]; then
    print_warning ".env.production already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setup cancelled."
        exit 0
    fi
fi

print_status "Setting up production environment variables..."

# Get production Razorpay keys
echo ""
print_status "Please enter your Razorpay Production Keys:"
echo ""

read -p "Enter Razorpay Production Key ID (starts with rzp_live_): " RAZORPAY_KEY_ID
read -s -p "Enter Razorpay Production Key Secret: " RAZORPAY_KEY_SECRET
echo ""

# Validate key format
if [[ ! $RAZORPAY_KEY_ID =~ ^rzp_live_ ]]; then
    print_error "Invalid Razorpay Key ID format. Should start with 'rzp_live_'"
    exit 1
fi

if [ -z "$RAZORPAY_KEY_SECRET" ]; then
    print_error "Razorpay Key Secret cannot be empty"
    exit 1
fi

# Create .env.production file
print_status "Creating .env.production file..."

cat > .env.production << EOF
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBTZwEHiG_KmjmZY1wXW3Xane8F4pUqq_E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=butterflyauthentique.in
NEXT_PUBLIC_FIREBASE_PROJECT_ID=butterflyauthentique33
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=butterflyauthentique33.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=147808797895
NEXT_PUBLIC_FIREBASE_APP_ID=1:147808797895:web:5013c06442c7063f796ae2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-KZCWPPK4G3

# Razorpay Configuration (PRODUCTION)
NEXT_PUBLIC_RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET

# Admin Configuration
ADMIN_EMAIL=butterfly.auth@gmail.com
ADMIN_PASSWORD=secure_admin_password

# App Configuration (Production)
NEXT_PUBLIC_APP_URL=https://butterflyauthentique33.web.app
NEXT_PUBLIC_APP_NAME=Butterfly Authentique
EOF

print_success ".env.production file created successfully!"

# Add to .gitignore if not already there
if ! grep -q ".env.production" .gitignore; then
    print_status "Adding .env.production to .gitignore..."
    echo "" >> .gitignore
    echo "# Production environment variables" >> .gitignore
    echo ".env.production" >> .gitignore
    print_success ".env.production added to .gitignore"
fi

# Set Firebase environment variables
print_status "Setting Firebase environment variables..."
firebase functions:config:set razorpay.key_id="$RAZORPAY_KEY_ID" razorpay.key_secret="$RAZORPAY_KEY_SECRET"

print_success "Firebase environment variables set!"

echo ""
print_success "🎉 Production setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure payment methods in Razorpay Dashboard"
echo "2. Test payments with small amounts"
echo "3. Deploy to production: npm run deploy"
echo ""
echo "📚 For detailed instructions, see: RAZORPAY_PRODUCTION_SETUP.md"
echo ""
print_warning "Remember: Never commit .env.production to git!" 