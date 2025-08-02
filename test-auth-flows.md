# Authentication Flow Testing Guide

## 🧪 **Testing Your Industry-Standard Authentication System**

This guide will help you test all the authentication flows we've implemented.

---

## 📋 **Test Checklist**

### **1. Registration Flow Test**
**URL**: `http://localhost:9000/register`

**Steps**:
1. ✅ Open registration page
2. ✅ Fill in form with valid data:
   - Name: `Test User`
   - Email: `test@example.com` (use a real email you can access)
   - Password: `TestPassword123`
   - Confirm Password: `TestPassword123`
   - Check "Agree to Terms"
3. ✅ Click "Create Account"
4. ✅ Should see success message: "Account created! Please check your email to verify your account"
5. ✅ Check email inbox (and spam folder) for verification email

**Expected Results**:
- ✅ Form validation works
- ✅ Email domain validation works (only common providers)
- ✅ Success message appears
- ✅ Verification email is sent

---

### **2. Email Verification Flow Test**
**URL**: `http://localhost:9000/verify-email`

**Steps**:
1. ✅ Open verification email from registration
2. ✅ Click verification link
3. ✅ Should be redirected to `/verify-email`
4. ✅ Should see "Email verified successfully!" message
5. ✅ Should see "Welcome to Butterfly Authentique!" success page

**Expected Results**:
- ✅ Verification link works
- ✅ Success message appears
- ✅ User can now sign in

---

### **3. Login Flow Test**
**URL**: `http://localhost:9000/login`

**Steps**:
1. ✅ Open login page
2. ✅ Try to login with unverified email (should fail)
3. ✅ Login with verified email:
   - Email: `test@example.com`
   - Password: `TestPassword123`
4. ✅ Should see "Welcome back!" message
5. ✅ Should be redirected to home page

**Expected Results**:
- ✅ Unverified users cannot login
- ✅ Verified users can login successfully
- ✅ Proper error messages for invalid credentials

---

### **4. Password Reset Flow Test**
**URL**: `http://localhost:9000/forgot-password`

**Steps**:
1. ✅ Open forgot password page
2. ✅ Enter email: `test@example.com`
3. ✅ Click "Send Reset Link"
4. ✅ Should see "Password reset email sent! Check your inbox"
5. ✅ Check email for reset link
6. ✅ Click reset link
7. ✅ Should be redirected to `/reset-password-confirm`
8. ✅ Enter new password: `NewPassword123`
9. ✅ Confirm new password: `NewPassword123`
10. ✅ Click "Update Password"
11. ✅ Should see "Password Updated Successfully!"

**Expected Results**:
- ✅ Reset email is sent
- ✅ Reset link works
- ✅ New password is accepted
- ✅ Success message appears

---

### **5. Error Handling Tests**

#### **Registration Errors**:
- ❌ Try invalid email (should show error)
- ❌ Try weak password (should show error)
- ❌ Try mismatched passwords (should show error)
- ❌ Try existing email (should show error)

#### **Login Errors**:
- ❌ Try wrong password (should show error)
- ❌ Try non-existent email (should show error)
- ❌ Try unverified email (should show error)

#### **Password Reset Errors**:
- ❌ Try non-existent email (should show error)
- ❌ Try invalid email format (should show error)

---

## 🔧 **Firebase Console Configuration**

### **Before Testing, Configure Email Templates**:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select Project**: `butterflyauthentique33`
3. **Navigate to**: Authentication → Templates
4. **Configure Email Verification Template**:
   - Sender name: `Butterfly Authentique`
   - Subject: `Verify your email address - Butterfly Authentique`
   - Action URL: `http://localhost:9000/verify-email` (for testing)
5. **Configure Password Reset Template**:
   - Sender name: `Butterfly Authentique`
   - Subject: `Reset your password - Butterfly Authentique`
   - Action URL: `http://localhost:9000/reset-password-confirm` (for testing)

---

## 🚨 **Common Issues & Solutions**

### **Emails Not Sending**:
- Check Firebase quotas
- Verify email templates are configured
- Check spam folder
- Verify authorized domains in Firebase Console

### **Links Not Working**:
- Verify Action URLs in email templates
- Check authorized domains include `localhost`
- Ensure proper redirect handling

### **Verification Not Working**:
- Check email template configuration
- Verify Action URL is correct
- Check browser console for errors

---

## ✅ **Success Criteria**

Your authentication system is working correctly if:

✅ **Registration sends verification email**  
✅ **Verification link works and confirms email**  
✅ **Unverified users cannot login**  
✅ **Verified users can login successfully**  
✅ **Password reset sends email**  
✅ **Password reset link works**  
✅ **New password can be set**  
✅ **All error messages are clear and helpful**  
✅ **UI/UX is smooth and professional**  

---

## 📞 **Need Help?**

If you encounter issues:

1. **Check browser console** for JavaScript errors
2. **Check Firebase Console** for authentication logs
3. **Verify email templates** are properly configured
4. **Test with different email providers** (Gmail, Yahoo, etc.)
5. **Check network tab** for failed requests

Your authentication system is now **industry-standard** and ready for production! 🎉 