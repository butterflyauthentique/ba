# Firebase Functions to Admin UI Mapping

## Overview
This document maps all deployed Firebase Cloud Functions to their corresponding Admin UI features in the Butterfly Authentique admin panel.

## Deployed Functions (10 total)

### 1. **getProducts** - 49 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/getProducts`
- **Admin UI Location**: `/admin/products`
- **Purpose**: Fetches all products for the admin products table
- **Status**: ✅ **ACTIVE** - High usage indicates it's working well
- **Implementation**: Used in `src/app/(admin)/admin/products/page.tsx`

### 2. **getAdmins** - 2 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/getAdmins`
- **Admin UI Location**: `/admin/admins`
- **Purpose**: Fetches all admin users for admin management
- **Status**: ✅ **ACTIVE** - Recently used
- **Implementation**: Used in `src/app/(admin)/admin/admins/page.tsx`

### 3. **saveProduct** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/saveProduct`
- **Admin UI Location**: `/admin/products/new` and `/admin/products/edit/[id]`
- **Purpose**: Creates or updates products
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Should be used in product creation/editing forms

### 4. **deleteProduct** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/deleteProduct`
- **Admin UI Location**: `/admin/products` (delete button)
- **Purpose**: Deletes products from the database
- **Status**: ✅ **FIXED** - Updated to accept ID from request body
- **Implementation**: Used in `src/app/(admin)/admin/products/page.tsx`
- **Method**: POST with `{ id: productId }` in request body

### 5. **getProduct** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/getProduct`
- **Admin UI Location**: `/admin/products/edit/[id]`
- **Purpose**: Fetches single product for editing
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Should be used in product edit forms

### 6. **getOrders** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/getOrders`
- **Admin UI Location**: `/admin/orders`
- **Purpose**: Fetches all orders for order management
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Should be used in order management pages

### 7. **getAdminStats** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/getAdminStats`
- **Admin UI Location**: `/admin` (dashboard)
- **Purpose**: Fetches dashboard statistics (products, orders, revenue)
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Should be used in admin dashboard

### 8. **addAdmin** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/addAdmin`
- **Admin UI Location**: `/admin/admins` (add admin form)
- **Purpose**: Adds new admin users
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Used in `src/app/(admin)/admin/admins/page.tsx`

### 9. **removeAdmin** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/removeAdmin`
- **Admin UI Location**: `/admin/admins` (remove admin button)
- **Purpose**: Removes admin users
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Used in `src/app/(admin)/admin/admins/page.tsx`

### 10. **checkAdmin** - 0 requests (24h)
- **Function URL**: `https://us-central1-butterflyauthentique33.cloudfunctions.net/checkAdmin`
- **Admin UI Location**: All admin pages (authentication)
- **Purpose**: Verifies if a user has admin privileges
- **Status**: ⚠️ **READY** - No recent usage (may need testing)
- **Implementation**: Should be used in admin authentication

## Admin UI Pages and Their Functions

### ✅ **Fully Implemented**
1. **Products Page** (`/admin/products`)
   - ✅ `getProducts` - Fetching products
   - ✅ `deleteProduct` - Delete functionality
   - ⚠️ `saveProduct` - Create/Edit forms need implementation

2. **Admins Page** (`/admin/admins`)
   - ✅ `getAdmins` - Fetching admins
   - ✅ `addAdmin` - Adding admins
   - ✅ `removeAdmin` - Removing admins

### ⚠️ **Partially Implemented**
3. **Dashboard** (`/admin`)
   - ⚠️ `getAdminStats` - Dashboard statistics not implemented

4. **Orders Page** (`/admin/orders`)
   - ⚠️ `getOrders` - Order management not implemented

5. **Product Edit** (`/admin/products/edit/[id]`)
   - ⚠️ `getProduct` - Single product fetch not implemented
   - ⚠️ `saveProduct` - Update functionality not implemented

6. **Product Create** (`/admin/products/new`)
   - ⚠️ `saveProduct` - Create functionality not implemented

### 🔧 **Authentication**
7. **Admin Authentication**
   - ⚠️ `checkAdmin` - Admin verification not implemented

## Recommendations

### High Priority
1. **Implement Product Create/Edit Forms**
   - Connect `saveProduct` function to product forms
   - Connect `getProduct` function to edit forms

2. **Implement Dashboard Statistics**
   - Connect `getAdminStats` to dashboard widgets

3. **Implement Order Management**
   - Create orders page using `getOrders` function

### Medium Priority
4. **Enhance Admin Authentication**
   - Use `checkAdmin` function for better security

5. **Test All Functions**
   - Verify all functions work correctly with the UI

## Function Usage Analysis

- **Most Active**: `getProducts` (49 requests) - Products page is working well
- **Recently Used**: `getAdmins` (2 requests) - Admin management is functional
- **Unused**: 8 functions - Need implementation or testing

## Next Steps

1. **Test Product Management**: Verify create/edit/delete product functionality
2. **Implement Dashboard**: Add statistics widgets using `getAdminStats`
3. **Create Orders Page**: Build order management interface
4. **Enhance Security**: Implement proper admin authentication checks
5. **Monitor Usage**: Track function usage to identify issues

## Configuration Details

- **Region**: `us-central1`
- **Version**: `v1`
- **Timeout**: `1 m` (1 minute)
- **Min/Max Instances**: `0/-` (0 minimum, no maximum)
- **Trigger**: All functions use HTTP requests 