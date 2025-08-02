# 🏗️ Branch Structure & Deployment Guide

## 📋 Current Repository Structure

### **Primary Repository: `ba`**
- **URL:** https://github.com/butterflyauthentique/ba
- **Default Branch:** `main`
- **Purpose:** Primary development and deployment repository
- **Hosting:** Firebase App Hosting
- **Payment:** Razorpay Production

### **Legacy Repositories (Archived)**
- **`master`:** Old App Hosting repository (archived)
- **`main`:** Old Classic Hosting repository (archived)

## 🔄 Deployment Workflow

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/butterflyauthentique/ba.git
cd ba

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Deployment Process**
```bash
# 1. Make changes and commit
git add .
git commit -m "Your commit message"
git push origin main

# 2. Deploy to Firebase
npm run deploy
```

### **GitHub Actions**
- **Trigger:** Push to `main` branch
- **Action:** Automatic deployment to Firebase Hosting
- **Status:** ✅ Active and configured

## 🏗️ Project Structure

```
ba_website/
├── src/                    # Next.js source code
├── functions/              # Firebase Cloud Functions
├── public/                 # Static assets
├── scripts/                # Deployment and utility scripts
├── .github/workflows/      # GitHub Actions
├── firebase.json           # Firebase configuration
├── firestore.rules         # Database security rules
└── storage.rules           # Storage security rules
```

## 🔧 Key Configuration Files

### **Environment Variables**
- `.env.local` - Local development (production keys)
- `.env.production` - Production deployment

### **Firebase Configuration**
- `firebase.json` - Project configuration
- `firestore.rules` - Database security
- `storage.rules` - File storage security

### **Deployment Scripts**
- `scripts/deploy.sh` - Main deployment script
- `scripts/restore-dev.sh` - Restore development environment
- `scripts/setup-production.sh` - Production setup

## 🚀 Production URLs

- **Main Site:** https://butterflyauthentique33.web.app
- **Admin Panel:** https://butterflyauthentique33.web.app/admin
- **Shop:** https://butterflyauthentique33.web.app/shop

## 🔐 Security Notes

- **Razorpay Keys:** Production keys configured
- **Firebase Functions:** Secure with proper authentication
- **Environment Variables:** Properly configured for production
- **Git History:** Cleaned of sensitive information

## 📚 Related Documentation

- `DEPLOYMENT_WORKFLOW.md` - Detailed deployment guide
- `RAZORPAY_PRODUCTION_SETUP.md` - Payment gateway setup
- `ba_initiate_project.cursor` - Project context and rules

## 🆘 Troubleshooting

### **Common Issues**
1. **403 Errors on Product Pages:** Fix Cloud Function authentication
2. **Build Failures:** Check environment variables
3. **Deployment Issues:** Verify Firebase project configuration

### **Quick Fixes**
```bash
# Restore development environment
npm run restore-dev

# Clean and rebuild
npm run clean && npm run build

# Deploy only hosting
firebase deploy --only hosting
```

---

**Last Updated:** December 2024  
**Repository:** https://github.com/butterflyauthentique/ba 