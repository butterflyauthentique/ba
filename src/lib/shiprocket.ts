// Shiprocket API Integration
// Documentation: https://apidocs.shiprocket.in/

import { Order } from '@/types/database';

// Shiprocket Configuration
const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

interface ShiprocketConfig {
    email: string;
    password: string;
}

// Token cache to avoid repeated authentication
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Authenticate with Shiprocket and get JWT token
 * Token is cached and reused until expiry
 */
export async function authenticateShiprocket(): Promise<string> {
    // Return cached token if still valid
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const config: ShiprocketConfig = {
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
        return cachedToken as string;
    } catch (error) {
        console.error('❌ Shiprocket authentication error:', error);
        throw error;
    }
}

/**
 * Make authenticated request to Shiprocket API
 */
async function shiprocketRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
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

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

export interface ShiprocketOrderPayload {
    order_id: string;
    order_date: string;
    pickup_location: string;
    channel_id?: string;
    comment?: string;
    billing_customer_name: string;
    billing_last_name: string;
    billing_address: string;
    billing_address_2?: string;
    billing_city: string;
    billing_pincode: string;
    billing_state: string;
    billing_country: string;
    billing_email: string;
    billing_phone: string;
    shipping_is_billing: boolean;
    shipping_customer_name?: string;
    shipping_last_name?: string;
    shipping_address?: string;
    shipping_address_2?: string;
    shipping_city?: string;
    shipping_pincode?: string;
    shipping_state?: string;
    shipping_country?: string;
    shipping_email?: string;
    shipping_phone?: string;
    order_items: {
        name: string;
        sku: string;
        units: number;
        selling_price: number;
        discount?: number;
        tax?: number;
        hsn?: number;
    }[];
    payment_method: string;
    shipping_charges?: number;
    giftwrap_charges?: number;
    transaction_charges?: number;
    total_discount?: number;
    sub_total: number;
    length: number;
    breadth: number;
    height: number;
    weight: number;
}

export interface ShiprocketOrderResponse {
    order_id: number;
    shipment_id: number;
    status: string;
    status_code: number;
    onboarding_completed_now: number;
    awb_code: string | null;
    courier_company_id: number | null;
    courier_name: string | null;
}

/**
 * Convert Butterfly Authentique order to Shiprocket format
 */
export function convertToShiprocketOrder(order: Order): ShiprocketOrderPayload {
    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';

    // Calculate total weight and dimensions
    let totalWeight = 0;
    let totalLength = 0;
    let totalBreadth = 0;
    let maxHeight = 0;

    // Default values if not present
    const defaultWeight = parseFloat(process.env.SHIPROCKET_DEFAULT_WEIGHT || '0.5');
    const defaultLength = 20;
    const defaultBreadth = 15;
    const defaultHeight = 10;

    order.items.forEach(item => {
        const itemWeight = item.weight || defaultWeight;
        const itemQuantity = item.quantity;
        totalWeight += itemWeight * itemQuantity;

        // Simple dimension calculation: Stack items by height, take max length/breadth
        // This is a simplification; for better packing logic, a bin packing algorithm is needed
        // But for now, this ensures we cover the volume
        const itemDims = item.dimensions || { length: defaultLength, breadth: defaultBreadth, height: defaultHeight };

        // We'll assume we pack them side-by-side or stacked. 
        // Let's take the max of length and breadth, and sum the heights? 
        // Or just sum the volumes and estimate?
        // Let's go with a safe approximation: Max Length, Max Breadth, Sum of Heights (stacking)
        // This might result in large heights, but it's safer than underestimating.
        // Actually, for shipping, volumetric weight is key.
        // Let's stick to the defaults if no dimensions are provided, otherwise use the item's dimensions.
        // If multiple items, we'll just take the max dimensions of a single item and maybe increase height?
        // Let's use a simpler approach: 
        // Length = Max(Item Lengths)
        // Breadth = Max(Item Breadths)
        // Height = Sum(Item Heights)

        totalLength = Math.max(totalLength, itemDims.length);
        totalBreadth = Math.max(totalBreadth, itemDims.breadth);
        maxHeight += itemDims.height * itemQuantity;
    });

    // Ensure minimums
    totalLength = totalLength || defaultLength;
    totalBreadth = totalBreadth || defaultBreadth;
    maxHeight = maxHeight || defaultHeight;
    totalWeight = totalWeight || defaultWeight;

    // Split customer name
    const nameParts = order.customer.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Determine if shipping address is same as billing
    const shippingIsBilling = !order.billingAddress ||
        (order.shippingAddress.addressLine1 === order.billingAddress.addressLine1);

    const payload: ShiprocketOrderPayload = {
        order_id: order.orderNumber,
        order_date: order.createdAt.toDate().toISOString().split('T')[0], // YYYY-MM-DD
        pickup_location: pickupLocation,
        channel_id: process.env.SHIPROCKET_CHANNEL_ID || '9005923',
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
            tax: item.taxRate || 0,
            hsn: item.hsn ? parseInt(item.hsn.replace(/\D/g, '')) : undefined, // Shiprocket expects integer HSN? API docs say string or int? 
            // Docs say `hsn` (Optional) : Harmonized System Nomenclature (HSN) code.
            // Let's check the type in `ShiprocketOrderPayload` interface. It says `hsn?: number;`.
            // So we must parse it.
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
        length: totalLength,
        breadth: totalBreadth,
        height: maxHeight,
        weight: totalWeight,
    };

    return payload;
}

/**
 * Create order in Shiprocket
 */
export async function createShiprocketOrder(order: Order): Promise<ShiprocketOrderResponse> {
    try {
        console.log(`📦 Creating Shiprocket order for ${order.orderNumber}`);

        const payload = convertToShiprocketOrder(order);

        const response = await shiprocketRequest<ShiprocketOrderResponse>(
            '/orders/create/adhoc',
            {
                method: 'POST',
                body: JSON.stringify(payload),
            }
        );

        console.log(`✅ Shiprocket order created: Order ID ${response.order_id}, Shipment ID ${response.shipment_id}`);
        return response;
    } catch (error) {
        console.error('❌ Error creating Shiprocket order:', error);
        throw error;
    }
}

// ============================================================================
// SHIPMENT OPERATIONS
// ============================================================================

export interface GenerateAWBPayload {
    shipment_id: number;
    courier_id?: number; // Optional: auto-select if not provided
}

export interface GenerateAWBResponse {
    awb_assign_status: number;
    response: {
        data: {
            awb_code: string;
            courier_company_id: number;
            courier_name: string;
            assigned_date_time: string;
            applied_weight: number;
            charged_weight: number;
            zone: string;
        };
    };
}

/**
 * Generate AWB (Air Waybill) for shipment
 * This assigns a courier and generates tracking number
 */
export async function generateAWB(
    shipmentId: number,
    courierId?: number
): Promise<GenerateAWBResponse> {
    try {
        console.log(`🏷️ Generating AWB for shipment ${shipmentId}`);

        const payload: GenerateAWBPayload = {
            shipment_id: shipmentId,
        };

        if (courierId) {
            payload.courier_id = courierId;
        }

        const response = await shiprocketRequest<GenerateAWBResponse>(
            '/courier/assign/awb',
            {
                method: 'POST',
                body: JSON.stringify(payload),
            }
        );

        console.log(`✅ AWB generated: ${response.response.data.awb_code}`);
        return response;
    } catch (error) {
        console.error('❌ Error generating AWB:', error);
        throw error;
    }
}

/**
 * Cancel shipment
 */
export async function cancelShipment(shipmentId: number): Promise<void> {
    try {
        console.log(`❌ Cancelling shipment ${shipmentId}`);

        await shiprocketRequest(
            `/orders/cancel/shipment/${shipmentId}`,
            {
                method: 'POST',
            }
        );

        console.log(`✅ Shipment ${shipmentId} cancelled`);
    } catch (error) {
        console.error('❌ Error cancelling shipment:', error);
        throw error;
    }
}

// ============================================================================
// RATE CALCULATION & SERVICEABILITY
// ============================================================================

export interface ServiceabilityParams {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number; // in kg
    cod?: boolean;
}

export interface CourierServiceability {
    courier_company_id: number;
    courier_name: string;
    freight_charge: number;
    cod_charges: number;
    estimated_delivery_days: string;
    is_surface: boolean;
    is_rto_address_available: boolean;
    etd: string;
}

/**
 * Check serviceability and get courier rates
 */
export async function getCourierRates(
    params: ServiceabilityParams
): Promise<CourierServiceability[]> {
    try {
        const queryParams = new URLSearchParams({
            pickup_postcode: params.pickup_postcode,
            delivery_postcode: params.delivery_postcode,
            weight: params.weight.toString(),
            cod: params.cod ? '1' : '0',
        });

        const response = await shiprocketRequest<{ data: { available_courier_companies: CourierServiceability[] } }>(
            `/courier/serviceability?${queryParams.toString()}`,
            {
                method: 'GET',
            }
        );

        return response.data.available_courier_companies || [];
    } catch (error) {
        console.error('❌ Error getting courier rates:', error);
        throw error;
    }
}

/**
 * Check if delivery is available to a pincode
 */
export async function checkServiceability(
    deliveryPincode: string,
    weight: number = 0.5
): Promise<boolean> {
    try {
        const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';
        const couriers = await getCourierRates({
            pickup_postcode: pickupPincode,
            delivery_postcode: deliveryPincode,
            weight,
            cod: false,
        });

        return couriers.length > 0;
    } catch (error) {
        console.error('❌ Error checking serviceability:', error);
        return false;
    }
}

// ============================================================================
// TRACKING
// ============================================================================

export interface TrackingEvent {
    date: string;
    status: string;
    activity: string;
    location: string;
    sr_status: string;
    sr_status_label: string;
}

export interface TrackingResponse {
    tracking_data: {
        track_status: number;
        shipment_status: number;
        shipment_track: TrackingEvent[];
        shipment_track_activities: {
            date: string;
            status: string;
            activity: string;
            location: string;
        }[];
    };
}

/**
 * Track shipment by AWB code
 */
export async function trackShipmentByAWB(awbCode: string): Promise<TrackingResponse> {
    try {
        const response = await shiprocketRequest<TrackingResponse>(
            `/courier/track/awb/${awbCode}`,
            {
                method: 'GET',
            }
        );

        return response;
    } catch (error) {
        console.error('❌ Error tracking shipment:', error);
        throw error;
    }
}

/**
 * Track shipment by Shiprocket shipment ID
 */
export async function trackShipmentById(shipmentId: number): Promise<TrackingResponse> {
    try {
        const response = await shiprocketRequest<TrackingResponse>(
            `/courier/track/shipment/${shipmentId}`,
            {
                method: 'GET',
            }
        );

        return response;
    } catch (error) {
        console.error('❌ Error tracking shipment:', error);
        throw error;
    }
}

/**
 * Get user-friendly status message from Shiprocket status
 */
export function getStatusMessage(status: string): string {
    const statusMap: Record<string, string> = {
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

// ============================================================================
// LABEL & MANIFEST
// ============================================================================

/**
 * Generate shipping label URL
 */
export async function generateShippingLabel(shipmentIds: number[]): Promise<string> {
    try {
        const response = await shiprocketRequest<{ label_url: string }>(
            '/courier/generate/label',
            {
                method: 'POST',
                body: JSON.stringify({
                    shipment_id: shipmentIds,
                }),
            }
        );

        return response.label_url;
    } catch (error) {
        console.error('❌ Error generating shipping label:', error);
        throw error;
    }
}

/**
 * Generate manifest for pickup
 */
export async function generateManifest(shipmentIds: number[]): Promise<string> {
    try {
        const response = await shiprocketRequest<{ manifest_url: string }>(
            '/manifest/generate',
            {
                method: 'POST',
                body: JSON.stringify({
                    shipment_id: shipmentIds,
                }),
            }
        );

        return response.manifest_url;
    } catch (error) {
        console.error('❌ Error generating manifest:', error);
        throw error;
    }
}
