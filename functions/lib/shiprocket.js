"use strict";
// Shiprocket API Integration
// Documentation: https://apidocs.shiprocket.in/
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateManifest = exports.generateShippingLabel = exports.getStatusMessage = exports.trackShipmentById = exports.trackShipmentByAWB = exports.checkServiceability = exports.getCourierRates = exports.cancelShipment = exports.generateAWB = exports.createShiprocketOrder = exports.convertToShiprocketOrder = exports.authenticateShiprocket = void 0;
// Shiprocket Configuration
const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
// Token cache to avoid repeated authentication
let cachedToken = null;
let tokenExpiry = null;
// ============================================================================
// AUTHENTICATION
// ============================================================================
/**
 * Authenticate with Shiprocket and get JWT token
 * Token is cached and reused until expiry
 */
async function authenticateShiprocket() {
    // Return cached token if still valid
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }
    const config = {
        email: process.env.NEXT_PUBLIC_SHIPROCKET_EMAIL || process.env.SHIPROCKET_EMAIL || '',
        password: process.env.NEXT_PUBLIC_SHIPROCKET_PASSWORD || process.env.SHIPROCKET_PASSWORD || '',
    };
    if (!config.email || !config.password) {
        throw new Error('Shiprocket credentials not configured. Please set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables.');
    }
    try {
        const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: config.email,
                password: config.password,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Shiprocket authentication failed: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        if (!data.token) {
            throw new Error('No token received from Shiprocket');
        }
        // Cache token (expires in 10 days according to docs, we'll refresh after 9 days)
        cachedToken = data.token;
        tokenExpiry = Date.now() + (9 * 24 * 60 * 60 * 1000); // 9 days
        console.log('✅ Shiprocket authentication successful');
        return cachedToken;
    }
    catch (error) {
        console.error('❌ Shiprocket authentication error:', error);
        throw error;
    }
}
exports.authenticateShiprocket = authenticateShiprocket;
/**
 * Make authenticated request to Shiprocket API
 */
async function shiprocketRequest(endpoint, options = {}) {
    const token = await authenticateShiprocket();
    const response = await fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Shiprocket API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    return response.json();
}
/**
 * Convert Butterfly Authentique order to Shiprocket format
 */
function convertToShiprocketOrder(order) {
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';
    // Calculate total weight (default 0.5kg if not specified)
    const defaultWeight = parseFloat(process.env.SHIPROCKET_DEFAULT_WEIGHT || '0.5');
    const totalWeight = order.items.length * defaultWeight;
    // Default dimensions (in cm)
    const defaultLength = 20;
    const defaultBreadth = 15;
    const defaultHeight = 10;
    // Split customer name
    const nameParts = order.customer.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;
    // Determine if shipping address is same as billing
    const shippingIsBilling = !order.billingAddress ||
        (order.shippingAddress.addressLine1 === order.billingAddress.addressLine1);
    const payload = {
        order_id: order.orderNumber,
        order_date: order.createdAt.toDate().toISOString().split('T')[0],
        pickup_location: pickupLocation,
        channel_id: '',
        comment: order.customerNotes || '',
        // Billing address
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: order.shippingAddress.addressLine1,
        billing_address_2: order.shippingAddress.addressLine2 || '',
        billing_city: order.shippingAddress.city,
        billing_pincode: order.shippingAddress.postalCode,
        billing_state: order.shippingAddress.state,
        billing_country: order.shippingAddress.country,
        billing_email: order.customer.email,
        billing_phone: order.customer.phone || '',
        // Shipping address
        shipping_is_billing: shippingIsBilling,
        shipping_customer_name: shippingIsBilling ? undefined : order.shippingAddress.firstName,
        shipping_last_name: shippingIsBilling ? undefined : order.shippingAddress.lastName,
        shipping_address: shippingIsBilling ? undefined : order.shippingAddress.addressLine1,
        shipping_address_2: shippingIsBilling ? undefined : order.shippingAddress.addressLine2,
        shipping_city: shippingIsBilling ? undefined : order.shippingAddress.city,
        shipping_pincode: shippingIsBilling ? undefined : order.shippingAddress.postalCode,
        shipping_state: shippingIsBilling ? undefined : order.shippingAddress.state,
        shipping_country: shippingIsBilling ? undefined : order.shippingAddress.country,
        shipping_email: shippingIsBilling ? undefined : order.customer.email,
        shipping_phone: shippingIsBilling ? undefined : order.customer.phone,
        // Order items
        order_items: order.items.map(item => ({
            name: item.productName,
            sku: item.sku,
            units: item.quantity,
            selling_price: item.price,
            discount: 0,
            tax: 0, // GST already included in price
        })),
        // Payment
        payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
        // Charges
        shipping_charges: order.shipping || 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: order.discount || 0,
        sub_total: order.subtotal,
        // Dimensions and weight
        length: defaultLength,
        breadth: defaultBreadth,
        height: defaultHeight,
        weight: totalWeight,
    };
    return payload;
}
exports.convertToShiprocketOrder = convertToShiprocketOrder;
/**
 * Create order in Shiprocket
 */
async function createShiprocketOrder(order) {
    try {
        console.log(`📦 Creating Shiprocket order for ${order.orderNumber}`);
        const payload = convertToShiprocketOrder(order);
        const response = await shiprocketRequest('/orders/create/adhoc', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        console.log(`✅ Shiprocket order created: Order ID ${response.order_id}, Shipment ID ${response.shipment_id}`);
        return response;
    }
    catch (error) {
        console.error('❌ Error creating Shiprocket order:', error);
        throw error;
    }
}
exports.createShiprocketOrder = createShiprocketOrder;
/**
 * Generate AWB (Air Waybill) for shipment
 * This assigns a courier and generates tracking number
 */
async function generateAWB(shipmentId, courierId) {
    try {
        console.log(`🏷️ Generating AWB for shipment ${shipmentId}`);
        const payload = {
            shipment_id: shipmentId,
        };
        if (courierId) {
            payload.courier_id = courierId;
        }
        const response = await shiprocketRequest('/courier/assign/awb', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        console.log(`✅ AWB generated: ${response.response.data.awb_code}`);
        return response;
    }
    catch (error) {
        console.error('❌ Error generating AWB:', error);
        throw error;
    }
}
exports.generateAWB = generateAWB;
/**
 * Cancel shipment
 */
async function cancelShipment(shipmentId) {
    try {
        console.log(`❌ Cancelling shipment ${shipmentId}`);
        await shiprocketRequest(`/orders/cancel/shipment/${shipmentId}`, {
            method: 'POST',
        });
        console.log(`✅ Shipment ${shipmentId} cancelled`);
    }
    catch (error) {
        console.error('❌ Error cancelling shipment:', error);
        throw error;
    }
}
exports.cancelShipment = cancelShipment;
/**
 * Check serviceability and get courier rates
 */
async function getCourierRates(params) {
    try {
        const queryParams = new URLSearchParams({
            pickup_postcode: params.pickup_postcode,
            delivery_postcode: params.delivery_postcode,
            weight: params.weight.toString(),
            cod: params.cod ? '1' : '0',
        });
        const response = await shiprocketRequest(`/courier/serviceability?${queryParams.toString()}`, {
            method: 'GET',
        });
        return response.data.available_courier_companies || [];
    }
    catch (error) {
        console.error('❌ Error getting courier rates:', error);
        throw error;
    }
}
exports.getCourierRates = getCourierRates;
/**
 * Check if delivery is available to a pincode
 */
async function checkServiceability(deliveryPincode, weight = 0.5) {
    try {
        const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';
        const couriers = await getCourierRates({
            pickup_postcode: pickupPincode,
            delivery_postcode: deliveryPincode,
            weight,
            cod: false,
        });
        return couriers.length > 0;
    }
    catch (error) {
        console.error('❌ Error checking serviceability:', error);
        return false;
    }
}
exports.checkServiceability = checkServiceability;
/**
 * Track shipment by AWB code
 */
async function trackShipmentByAWB(awbCode) {
    try {
        const response = await shiprocketRequest(`/courier/track/awb/${awbCode}`, {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        console.error('❌ Error tracking shipment:', error);
        throw error;
    }
}
exports.trackShipmentByAWB = trackShipmentByAWB;
/**
 * Track shipment by Shiprocket shipment ID
 */
async function trackShipmentById(shipmentId) {
    try {
        const response = await shiprocketRequest(`/courier/track/shipment/${shipmentId}`, {
            method: 'GET',
        });
        return response;
    }
    catch (error) {
        console.error('❌ Error tracking shipment:', error);
        throw error;
    }
}
exports.trackShipmentById = trackShipmentById;
/**
 * Get user-friendly status message from Shiprocket status
 */
function getStatusMessage(status) {
    const statusMap = {
        'NEW': 'Order Created',
        'PICKUP_SCHEDULED': 'Pickup Scheduled',
        'PICKUP_COMPLETE': 'Picked Up',
        'IN_TRANSIT': 'In Transit',
        'OUT_FOR_DELIVERY': 'Out for Delivery',
        'DELIVERED': 'Delivered',
        'CANCELLED': 'Cancelled',
        'RTO_INITIATED': 'Return Initiated',
        'RTO_DELIVERED': 'Returned',
        'LOST': 'Lost in Transit',
        'DAMAGED': 'Damaged',
    };
    return statusMap[status] || status;
}
exports.getStatusMessage = getStatusMessage;
// ============================================================================
// LABEL & MANIFEST
// ============================================================================
/**
 * Generate shipping label URL
 */
async function generateShippingLabel(shipmentIds) {
    try {
        const response = await shiprocketRequest('/courier/generate/label', {
            method: 'POST',
            body: JSON.stringify({
                shipment_id: shipmentIds,
            }),
        });
        return response.label_url;
    }
    catch (error) {
        console.error('❌ Error generating shipping label:', error);
        throw error;
    }
}
exports.generateShippingLabel = generateShippingLabel;
/**
 * Generate manifest for pickup
 */
async function generateManifest(shipmentIds) {
    try {
        const response = await shiprocketRequest('/manifest/generate', {
            method: 'POST',
            body: JSON.stringify({
                shipment_id: shipmentIds,
            }),
        });
        return response.manifest_url;
    }
    catch (error) {
        console.error('❌ Error generating manifest:', error);
        throw error;
    }
}
exports.generateManifest = generateManifest;
//# sourceMappingURL=shiprocket.js.map