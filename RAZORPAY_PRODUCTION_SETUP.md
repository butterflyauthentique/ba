# Razorpay Production Setup Guide

## 🚀 Getting Ready for Production Payments

Now that your Razorpay KYC is complete, follow this guide to set up production payments.

## 📋 Prerequisites

- ✅ Razorpay KYC completed
- ✅ Business verification done
- ✅ Bank account linked
- ✅ Production account activated

## 🔧 Step 1: Configure Payment Methods in Razorpay Dashboard

### **📍 Dashboard Settings:**

1. **Login to Razorpay Dashboard:** https://dashboard.razorpay.com/
2. **Navigate to:** Settings → Payment Methods
3. **Configure Payment Options:**

#### **Recommended Settings:**
```
✅ UPI (Most Popular in India)
✅ Credit/Debit Cards
✅ Net Banking
✅ Digital Wallets (Paytm, PhonePe, etc.)
❌ EMI (Optional - enable if you want to offer EMI)
❌ International Cards (Enable if you want foreign payments)
```

#### **UPI Configuration:**
- Enable all major UPI apps
- Set UPI as preferred payment method
- Configure UPI QR codes if needed

#### **Card Configuration:**
- Enable all major card networks (Visa, Mastercard, RuPay)
- Configure 3D Secure if required
- Set card as secondary payment method

## 🔑 Step 2: Get Production API Keys

### **📍 Get Your Production Keys:**

1. **Go to:** https://dashboard.razorpay.com/
2. **Navigate to:** Settings → API Keys
3. **Copy these keys:**
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret** (starts with `rzp_live_`)

### **⚠️ Security Important:**
- **Never commit production keys to git**
- **Keep them in environment variables**
- **Use different keys for test and production**

## 🔄 Step 3: Update Environment Variables

### **📍 Create Production Environment File:**

Create a new file called `.env.production` (this will be used for production deployment):

```bash
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBTZwEHiG_KmjmZY1wXW3Xane8F4pUqq_E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=butterflyauthentique.in
NEXT_PUBLIC_FIREBASE_PROJECT_ID=butterflyauthentique33
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=butterflyauthentique33.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=147808797895
NEXT_PUBLIC_FIREBASE_APP_ID=1:147808797895:web:5013c06442c7063f796ae2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-KZCWPPK4G3

# Razorpay Configuration (PRODUCTION)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_PRODUCTION_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_PRODUCTION_KEY_SECRET

# Admin Configuration
ADMIN_EMAIL=butterfly.auth@gmail.com
ADMIN_PASSWORD=secure_admin_password

# App Configuration (Production)
NEXT_PUBLIC_APP_URL=https://butterflyauthentique33.web.app
NEXT_PUBLIC_APP_NAME=Butterfly Authentique
```

### **📍 Update Local Development Environment:**

Update your `.env.local` file for local development:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBTZwEHiG_KmjmZY1wXW3Xane8F4pUqq_E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=butterflyauthentique.in
NEXT_PUBLIC_FIREBASE_PROJECT_ID=butterflyauthentique33
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=butterflyauthentique33.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=147808797895
NEXT_PUBLIC_FIREBASE_APP_ID=1:147808797895:web:5013c06442c7063f796ae2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-KZCWPPK4G3

# Razorpay Configuration (TEST for local development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_AaXoLwVs0isbmk
RAZORPAY_KEY_SECRET=07tAIwsgvSam2leJPhNA74tR

# Admin Configuration
ADMIN_EMAIL=butterfly.auth@gmail.com
ADMIN_PASSWORD=secure_admin_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Butterfly Authentique
```

## 🔧 Step 4: Update Razorpay Configuration

### **📍 Update the Razorpay Config File:**

The system will automatically use the correct keys based on the environment. The current configuration in `src/lib/razorpay.ts` is already set up to use environment variables.

### **📍 Verify Configuration:**

Check that your `src/lib/razorpay.ts` file has this structure:

```typescript
export const razorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_AaXoLwVs0isbmk",
keySecret: process.env.RAZORPAY_KEY_SECRET || "07tAIwsgvSam2leJPhNA74tR",
};
```

## 🚀 Step 5: Deploy to Production

### **📍 Deploy with Production Environment:**

```bash
# Deploy to production
npm run deploy
```

The deployment will automatically use the production environment variables.

## 🧪 Step 6: Test Production Payments

### **📍 Test Payment Flow:**

1. **Go to your production site:** https://butterflyauthentique33.web.app
2. **Add items to cart**
3. **Proceed to checkout**
4. **Test with small amounts first**
5. **Verify payment success**

### **📍 Test Payment Methods:**

- **UPI:** Use any UPI app (Google Pay, PhonePe, etc.)
- **Cards:** Use test cards or real cards
- **Net Banking:** Test with your bank
- **Wallets:** Test with Paytm, PhonePe, etc.

## 🔍 Step 7: Monitor Payments

### **📍 Razorpay Dashboard Monitoring:**

1. **Go to:** https://dashboard.razorpay.com/
2. **Navigate to:** Payments → Transactions
3. **Monitor:**
   - Successful payments
   - Failed payments
   - Refunds
   - Settlement reports

### **📍 Key Metrics to Watch:**

- **Success Rate:** Should be >95%
- **Average Transaction Value**
- **Payment Method Distribution**
- **Failed Payment Reasons**

## ⚠️ Important Security Notes

### **📍 Environment Variables:**

- **Never commit `.env.production` to git**
- **Add `.env.production` to `.gitignore`**
- **Use Firebase Environment Variables for production**

### **📍 Firebase Environment Variables:**

For production deployment, set environment variables in Firebase:

```bash
# Set production environment variables in Firebase
firebase functions:config:set razorpay.key_id="rzp_live_YOUR_KEY_ID"
firebase functions:config:set razorpay.key_secret="YOUR_KEY_SECRET"
```

## 🔧 Troubleshooting

### **📍 Common Issues:**

1. **Payment Failed:**
   - Check Razorpay dashboard for error details
   - Verify API keys are correct
   - Check if payment method is enabled

2. **Webhook Issues:**
   - Verify webhook URL in Razorpay dashboard
   - Check webhook signature verification

3. **Settlement Issues:**
   - Verify bank account details
   - Check settlement schedule
   - Contact Razorpay support if needed

## 📞 Support

### **📍 Razorpay Support:**

- **Email:** care@razorpay.com
- **Phone:** 1800-123-4567
- **Documentation:** https://razorpay.com/docs/

### **📍 Your Contact:**

For technical issues with the website integration, use your contact form at: https://butterflyauthentique33.web.app/contact

---

## 🎉 You're Ready for Production!

Once you've completed these steps, your website will be ready to accept real payments from customers. Remember to:

1. **Test thoroughly** with small amounts
2. **Monitor payments** regularly
3. **Keep your API keys secure**
4. **Update payment methods** as needed

**Good luck with your business! 🚀** 