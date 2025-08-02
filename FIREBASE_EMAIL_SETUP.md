# Firebase Email Authentication Setup Guide

## 🎯 **Industry-Standard Email Authentication Configuration**

This guide will help you configure Firebase Authentication with professional email templates and proper security settings.

---

## 📧 **1. Firebase Email Templates Configuration**

### **Step 1: Access Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `butterflyauthentique33`
3. Navigate to **Authentication** → **Templates**

### **Step 2: Configure Email Verification Template**

**Template Settings:**
- **Sender name**: `Butterfly Authentique`
- **Sender email**: `noreply@butterflyauthentique33.firebaseapp.com`
- **Subject**: `Verify your email address - Butterfly Authentique`
- **Action URL**: `https://butterflyauthentique33.web.app/verify-email`

**Email Content:**
```html
<h2>Welcome to Butterfly Authentique! 🦋</h2>

<p>Hi there,</p>

<p>Thank you for creating an account with Butterfly Authentique. To complete your registration and start exploring our beautiful collection of authentic Indian art and jewelry, please verify your email address.</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{link}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
    Verify Email Address
  </a>
</div>

<p>If the button doesn't work, you can copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{link}}</p>

<p><strong>Why verify your email?</strong></p>
<ul>
  <li>Access your account and order history</li>
  <li>Receive order updates and tracking information</li>
  <li>Get exclusive offers and new product notifications</li>
  <li>Ensure account security</li>
</ul>

<p>If you didn't create an account with Butterfly Authentique, you can safely ignore this email.</p>

<p>Best regards,<br>
The Butterfly Authentique Team</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
<p style="font-size: 12px; color: #666;">
  This email was sent to {{email}}. If you have any questions, please contact us at support@butterflyauthentique.com
</p>
```

### **Step 3: Configure Password Reset Template**

**Template Settings:**
- **Sender name**: `Butterfly Authentique`
- **Sender email**: `noreply@butterflyauthentique33.firebaseapp.com`
- **Subject**: `Reset your password - Butterfly Authentique`
- **Action URL**: `https://butterflyauthentique33.web.app/reset-password-confirm`

**Email Content:**
```html
<h2>Password Reset Request 🔐</h2>

<p>Hi there,</p>

<p>We received a request to reset the password for your Butterfly Authentique account. If you made this request, please click the button below to create a new password.</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{link}}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
    Reset Password
  </a>
</div>

<p>If the button doesn't work, you can copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #666;">{{link}}</p>

<p><strong>Security Notice:</strong></p>
<ul>
  <li>This link will expire in 1 hour</li>
  <li>If you didn't request a password reset, please ignore this email</li>
  <li>Your password will remain unchanged if you don't use this link</li>
</ul>

<p>If you didn't request this password reset, please contact our support team immediately at support@butterflyauthentique.com</p>

<p>Best regards,<br>
The Butterfly Authentique Team</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
<p style="font-size: 12px; color: #666;">
  This email was sent to {{email}}. For security reasons, this link will expire in 1 hour.
</p>
```

---

## 🔧 **2. Firebase Authentication Settings**

### **Step 1: Enable Email/Password Authentication**
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Configure settings:
   - ✅ **Email link (passwordless sign-in)**: Disabled
   - ✅ **Email verification**: Enabled
   - ✅ **Prevent abuse**: Enabled

### **Step 2: Configure Security Settings**
1. Go to **Authentication** → **Settings**
2. Configure **Authorized domains**:
   - `butterflyauthentique33.web.app`
   - `localhost` (for development)

### **Step 3: Set Up Custom Claims (Optional)**
For admin users, you can set custom claims in Firebase Functions:

```javascript
// In Firebase Functions
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set admin claims');
  }
  
  await admin.auth().setCustomUserClaims(data.uid, { admin: true });
  return { success: true };
});
```

---

## 🛡️ **3. Security Best Practices**

### **Rate Limiting**
- **Email verification**: Max 3 attempts per hour
- **Password reset**: Max 5 attempts per hour
- **Sign-in attempts**: Max 10 attempts per hour

### **Password Requirements**
- Minimum 6 characters (Firebase default)
- Consider implementing stronger requirements:
  - At least 8 characters
  - Mix of uppercase, lowercase, numbers, symbols
  - Not in common password list

### **Email Validation**
- Domain validation (implemented in code)
- Disposable email blocking
- Business email validation for admin accounts

---

## 📱 **4. User Experience Enhancements**

### **Email Verification Flow**
1. User registers → Email sent automatically
2. User clicks link → Redirected to `/verify-email`
3. Verification confirmed → User can sign in
4. If link expires → User can request new email

### **Password Reset Flow**
1. User requests reset → Email sent
2. User clicks link → Redirected to `/reset-password-confirm`
3. User sets new password → Confirmation shown
4. User can sign in with new password

### **Error Handling**
- Clear error messages for all scenarios
- Helpful troubleshooting tips
- Support contact information
- Rate limiting feedback

---

## 🧪 **5. Testing Your Setup**

### **Test Email Verification**
1. Register a new account
2. Check email inbox (and spam folder)
3. Click verification link
4. Verify user can sign in

### **Test Password Reset**
1. Go to forgot password page
2. Enter email address
3. Check email for reset link
4. Set new password
5. Verify user can sign in

### **Test Error Scenarios**
- Invalid email addresses
- Expired links
- Too many requests
- Invalid passwords

---

## 📊 **6. Monitoring and Analytics**

### **Firebase Analytics**
Track authentication events:
- `sign_up`
- `login`
- `password_reset`
- `email_verification`

### **Error Monitoring**
Monitor common issues:
- Failed sign-in attempts
- Email delivery failures
- Invalid verification links

---

## 🚀 **7. Production Deployment Checklist**

- [ ] Email templates configured
- [ ] Authorized domains set
- [ ] Security rules updated
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Analytics tracking enabled
- [ ] Support email configured
- [ ] Privacy policy updated
- [ ] Terms of service updated

---

## 📞 **8. Support and Maintenance**

### **Common Issues**
1. **Emails not sending**: Check Firebase quotas and settings
2. **Links not working**: Verify authorized domains
3. **Rate limiting**: Implement proper error handling
4. **Spam filtering**: Use proper sender authentication

### **Support Resources**
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Email Templates Guide](https://firebase.google.com/docs/auth/custom-email)
- [Security Best Practices](https://firebase.google.com/docs/auth/security)

---

## ✅ **Implementation Status**

Your authentication system now includes:

✅ **Professional email templates**  
✅ **Complete verification flow**  
✅ **Password reset functionality**  
✅ **Rate limiting protection**  
✅ **Error handling**  
✅ **User-friendly UI/UX**  
✅ **Security best practices**  
✅ **Industry-standard implementation**  

This setup provides a robust, secure, and user-friendly authentication experience that meets industry standards for e-commerce platforms. 