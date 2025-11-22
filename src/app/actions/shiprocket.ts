'use server';

import {
    createShiprocketOrder,
    generateAWB,
    generateShippingLabel,
    trackShipmentByAWB,
    cancelShipment,
    checkServiceability,
    getCourierRates
} from '@/lib/shiprocket';
import { Order } from '@/types/database';

/**
 * Server Action to create a Shiprocket order
 */
export async function createShipmentAction(order: Order) {
    try {
        const result = await createShiprocketOrder(order);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error creating shipment:', error);
        return { success: false, error: error.message || 'Failed to create shipment' };
    }
}

/**
 * Server Action to generate AWB
 */
export async function generateAWBAction(shipmentId: number, courierId?: number) {
    try {
        const result = await generateAWB(shipmentId, courierId);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error generating AWB:', error);
        return { success: false, error: error.message || 'Failed to generate AWB' };
    }
}

/**
 * Server Action to generate Label URL
 */
export async function generateLabelAction(shipmentId: number) {
    try {
        const result = await generateShippingLabel([shipmentId]);
        return { success: true, data: { label_url: result } };
    } catch (error: any) {
        console.error('Error generating label:', error);
        return { success: false, error: error.message || 'Failed to generate label' };
    }
}

/**
 * Server Action to get Tracking Data
 */
export async function getTrackingAction(awb: string) {
    try {
        const result = await trackShipmentByAWB(awb);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error getting tracking data:', error);
        return { success: false, error: error.message || 'Failed to get tracking data' };
    }
}

/**
 * Server Action to cancel shipment
 */
export async function cancelShipmentAction(shipmentId: number) {
    try {
        const result = await cancelShipment(shipmentId);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error cancelling shipment:', error);
        return { success: false, error: error.message || 'Failed to cancel shipment' };
    }
}

/**
 * Server Action to check serviceability
 */
export async function checkServiceabilityAction(pincode: string, weight: number) {
    try {
        const result = await checkServiceability(pincode, weight);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error checking serviceability:', error);
        return { success: false, error: error.message || 'Failed to check serviceability' };
    }
}

/**
 * Server Action to get courier rates
 */
export async function getRatesAction(pickupPincode: number, deliveryPincode: number, weight: number, cod: boolean) {
    try {
        const result = await getCourierRates({
            pickup_postcode: pickupPincode.toString(),
            delivery_postcode: deliveryPincode.toString(),
            weight,
            cod,
        });
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error getting rates:', error);
        return { success: false, error: error.message || 'Failed to get rates' };
    }
}
