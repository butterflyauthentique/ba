# Deployment Workflow

## Pre-Deployment Checklist

1. ✅ Ensure all changes are committed and pushed to git
2. ✅ Test locally with `npm run dev`
3. ✅ Verify Firebase configuration is correct

## Deployment Steps

1. **Deploy to Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

2. **⚠️ IMPORTANT: Fix Cloud Function Authentication (After App Hosting Migration)**
   
   If you get 403 errors on product pages after deployment, follow these steps:
   
   **Google Cloud Console Method:**
   1. Go to [Google Cloud Console - Functions](https://console.cloud.google.com/functions/list?project=butterflyauthentique33)
   2. Find the function `ssrbutterflyauthentique`
   3. Click on the function name
   4. Go to **Permissions** tab
   5. Click **Add Principal**
   6. Add `allUsers` with role `Cloud Functions Invoker`
   7. Save the changes
   
   **Firebase Console Method:**
   1. Go to [Firebase Console - Functions](https://console.firebase.google.com/project/butterflyauthentique33/functions)
   2. Find the function `ssrbutterflyauthentique`
   3. Click on the function name
   4. Go to **Permissions** tab
   5. Add a new member: `allUsers` with role `Cloud Functions Invoker`

3. **Test Production:**
   ```bash
   curl -I https://butterflyauthentique33.web.app/product/diego-rivera-inspired-flower-seller-replica-hand-painted-acrylic-on-canvas-mexican-art-
   ```

## Post-Deployment Steps

### 1. Restart Local Development Server
After deployment, restart your local development server:

```bash
# Option 1: Use the restart script
npm run restart-dev

# Option 2: Manual restart
pkill -f "next dev"  # Stop existing server
rm -rf .next         # Clean cache
npm run dev          # Start fresh
```

### 2. Verify Production
- ✅ Homepage loads correctly
- ✅ Shop page displays products
- ✅ Product detail pages work (no 403 errors)
- ✅ Admin panel accessible
- ✅ All functionality working as expected

## Troubleshooting

### 403 Error on Product Pages
- **Cause:** Cloud Function requires authentication after App Hosting migration
- **Solution:** Follow the manual authentication fix above
- **Prevention:** This setting persists across deployments

### Local vs Production Issues
- **Local:** Works fine (no Cloud Function needed)
- **Production:** May require manual authentication fix after deployment 