# 🚀 Butterfly Authentique Deployment Guide

This guide explains how to deploy the Butterfly Authentique website to Firebase using our optimized deployment script.

## 📋 Prerequisites

Before deploying, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** (for version control)

## 🔧 Setup

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Verify Firebase project**:
   ```bash
   firebase projects:list
   ```

## 🎯 Deployment Script

We've created an intelligent deployment script (`ba-deploy.sh`) that:

- ✅ **Detects changes** since last deployment
- ✅ **Optimizes deployments** (only deploys what changed)
- ✅ **Handles git operations** (commit, push)
- ✅ **Builds the project** automatically
- ✅ **Deploys to Firebase** with proper error handling
- ✅ **Provides colored output** for better UX

## 🚀 Quick Deployment

### Normal Deployment (Recommended)
```bash
npm run deploy
```
This will:
- Detect what has changed
- Only deploy affected components
- Commit and push changes

### Force Full Deployment
```bash
npm run deploy:force
```
This will deploy everything regardless of changes.

### Build Only
```bash
npm run deploy:build
```
This will only build the project without deploying.

### Deploy Only
```bash
npm run deploy:only
```
This will only deploy without git operations.

## 📁 What Gets Deployed

The script intelligently detects and deploys:

### 🏠 **Hosting** (Frontend)
**Triggered when:**
- Any `.tsx`, `.jsx`, `.css`, `.scss`, `.json`, `.md`, `.html` files change
- `next.config.js`, `tailwind.config.js`, `package.json` change

**What gets deployed:**
- Static website files
- All pages and components
- CSS and JavaScript bundles

### 🔥 **Firestore Rules**
**Triggered when:**
- `firestore.rules` file changes

**What gets deployed:**
- Database security rules
- Access permissions

### 📦 **Storage Rules**
**Triggered when:**
- `storage.rules` file changes

**What gets deployed:**
- File storage security rules
- Image upload permissions

### ⚡ **Functions** (Future)
**Triggered when:**
- Any files in `functions/` directory change

**What gets deployed:**
- Cloud functions (when added)

## 🔍 Change Detection Logic

The script uses intelligent change detection:

1. **Finds last deployment commit** (looks for commits with "deploy" in message)
2. **Compares files** since that commit
3. **Determines what to deploy** based on file types
4. **Optimizes deployment** by only deploying affected components

## 📊 Deployment Process

### 1. **Pre-deployment Checks**
- ✅ Verifies git repository
- ✅ Checks for uncommitted changes
- ✅ Validates current branch
- ✅ Ensures Firebase CLI is installed

### 2. **Change Detection**
- 🔍 Analyzes changes since last deployment
- 🎯 Determines which components need deployment
- 📝 Shows what will be deployed

### 3. **Build Process**
- 📦 Installs dependencies (if needed)
- 🔨 Builds Next.js project
- 📤 Exports static files

### 4. **Firebase Deployment**
- 🚀 Deploys only affected components
- 🔐 Updates security rules (if changed)
- 🌐 Updates hosting (if frontend changed)

### 5. **Git Operations**
- 💾 Commits deployment
- 📤 Pushes to remote repository
- 📋 Shows deployment summary

## 🛠️ Manual Deployment

If you prefer manual deployment:

### Build the Project
```bash
npm run build
npm run export
```

### Deploy to Firebase
```bash
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage
```

## 🔧 Configuration

### Project Settings
Edit `ba-deploy.sh` to customize:

```bash
PROJECT_NAME="butterfly-authentique"
FIREBASE_PROJECT="butterflyauthentique33"
DEPLOY_BRANCH="main"
BUILD_DIR="out"
```

### Firebase Configuration
The script uses your existing `firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**1. Firebase CLI not found**
```bash
npm install -g firebase-tools
```

**2. Not logged into Firebase**
```bash
firebase login
```

**3. Wrong Firebase project**
```bash
firebase use butterflyauthentique33
```

**4. Build errors**
```bash
npm install
npm run build
```

**5. Permission denied**
```bash
chmod +x ba-deploy.sh
```

### Error Recovery

If deployment fails:

1. **Check the error message** in the output
2. **Fix the issue** (missing dependencies, build errors, etc.)
3. **Re-run deployment**:
   ```bash
   npm run deploy:force
   ```

## 📈 Performance Optimization

The deployment script is optimized for:

- **Speed**: Only deploys what changed
- **Reliability**: Error handling and rollback capabilities
- **Efficiency**: Smart dependency management
- **Transparency**: Clear output and progress indicators

## 🔄 Continuous Deployment

For automated deployments, you can:

1. **Set up GitHub Actions** to run on push to main branch
2. **Use Firebase CLI in CI/CD** pipelines
3. **Configure webhooks** for automatic deployments

## 📞 Support

If you encounter issues:

1. **Check the logs** in the deployment output
2. **Verify prerequisites** are installed
3. **Test with manual deployment** first
4. **Check Firebase Console** for deployment status

---

**Happy Deploying! 🚀** 