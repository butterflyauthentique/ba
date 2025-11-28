# Shiprocket Integration Review

## Overall Assessment
The Shiprocket integration is **mostly well-implemented** and covers the core functionalities required for an e-commerce operation:
- ✅ **Authentication**: Correctly implemented with token caching.
- ✅ **Order Creation**: Maps fields correctly to the `/orders/create/adhoc` endpoint.
- ✅ **Serviceability**: Correctly checks for courier availability.
- ✅ **Tracking**: Implements tracking by AWB.
- ✅ **Webhooks**: Handles status updates and syncs them to Firestore.

However, there are some **critical areas for improvement** to ensure accurate shipping costs, compliance, and smoother operations.

## Key Findings & Recommendations

### 1. Product Dimensions & Weight (Critical)
**Current Implementation:**
The code uses hardcoded default dimensions (`20x15x10 cm`) and a default weight (`0.5 kg`) for all orders.
```typescript
// src/lib/shiprocket.ts
const defaultWeight = parseFloat(process.env.SHIPROCKET_DEFAULT_WEIGHT || '0.5');
const defaultLength = 20;
const defaultBreadth = 15;
const defaultHeight = 10;
```

**Risk:**
- **Under-weight**: If actual items are heavier/larger, couriers will charge penalties, and you may face disputes.
- **Over-weight**: You might overpay for shipping small items.

**Recommendation:**
- Add `weight`, `length`, `breadth`, `height` fields to your `Product` schema in Firestore.
- Calculate the total volumetric weight and dimensions dynamically based on the items in the cart.

### 2. HSN Code & Tax (Compliance)
**Current Implementation:**
HSN codes are missing, and tax is hardcoded to `0`.
```typescript
// src/lib/shiprocket.ts
tax: 0, // GST already included in price
// hsn: missing
```

**Risk:**
- **Compliance**: HSN codes are mandatory for shipping goods in India, especially for inter-state commerce and E-way bill generation.
- **Invoices**: If you use Shiprocket to generate invoices, they will be incorrect without tax rates and HSN codes.

**Recommendation:**
- Add `hsn` and `taxRate` fields to your `Product` schema.
- Pass these values in the `order_items` array.

### 3. Channel ID
**Current Implementation:**
Uses a default or environment variable.
```typescript
channel_id: process.env.SHIPROCKET_CHANNEL_ID || '9005923',
```
**Recommendation:**
- Ensure `SHIPROCKET_CHANNEL_ID` is correctly set in your `.env` files. The default `9005923` might not correspond to your actual "Custom" channel in Shiprocket. You can find your Channel ID in Shiprocket Settings > Channels.

### 4. Webhook Security
**Current Implementation:**
Checks `x-api-key` against `SHIPROCKET_WEBHOOK_SECRET`.
```typescript
// functions/src/shippingWebhook.ts
const providedToken = req.headers['x-api-key'];
```
**Recommendation:**
- Ensure you have actually configured this secret in your Shiprocket dashboard (Settings > API > Webhooks) and in your Firebase environment variables.

### 5. Error Handling & Retries
**Current Implementation:**
Catches errors and logs them.
**Recommendation:**
- Consider implementing a retry mechanism for critical failures (like Order Creation). If the API call fails, the order might be stuck in "Confirmed" state without a corresponding Shiprocket order.
- You might want a "Retry Shiprocket Sync" button in your Admin Dashboard.

## Summary Checklist for "Production-Ready" Status

- [ ] Update `Product` schema with `weight`, `dimensions`, `hsn`, `taxRate`.
- [ ] Update `createShiprocketOrder` to use dynamic values for weight/dims/hsn.
- [ ] Verify `SHIPROCKET_CHANNEL_ID` in environment variables.
- [ ] Test the integration with a real order to verify the payload received by Shiprocket.
