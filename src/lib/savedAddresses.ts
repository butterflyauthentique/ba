import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    writeBatch,
    getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { SavedAddress } from '@/types/database';

const COLLECTION_NAME = 'savedAddresses';

/**
 * Get all saved addresses for a user
 */
export async function getSavedAddresses(userId: string): Promise<SavedAddress[]> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SavedAddress));
    } catch (error) {
        console.error('Error fetching saved addresses:', error);
        return [];
    }
}

/**
 * Save a new address
 */
export async function saveAddress(userId: string, address: Omit<SavedAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
        // Check if this is the first address, if so make it default
        const existingAddresses = await getSavedAddresses(userId);
        const isDefault = existingAddresses.length === 0 || address.isDefault;

        // If setting as default, unset other defaults
        if (isDefault && existingAddresses.length > 0) {
            const batch = writeBatch(db);
            existingAddresses.forEach(addr => {
                if (addr.isDefault) {
                    const ref = doc(db, COLLECTION_NAME, addr.id);
                    batch.update(ref, { isDefault: false });
                }
            });
            await batch.commit();
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...address,
            userId,
            isDefault,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return docRef.id;
    } catch (error) {
        console.error('Error saving address:', error);
        throw error;
    }
}

/**
 * Update an existing address
 */
export async function updateAddress(addressId: string, userId: string, updates: Partial<SavedAddress>): Promise<void> {
    try {
        // If setting as default, unset other defaults
        if (updates.isDefault) {
            const existingAddresses = await getSavedAddresses(userId);
            const batch = writeBatch(db);

            existingAddresses.forEach(addr => {
                if (addr.id !== addressId && addr.isDefault) {
                    const ref = doc(db, COLLECTION_NAME, addr.id);
                    batch.update(ref, { isDefault: false });
                }
            });
            await batch.commit();
        }

        const docRef = doc(db, COLLECTION_NAME, addressId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, addressId));
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
}

/**
 * Set an address as default
 */
export async function setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
        const existingAddresses = await getSavedAddresses(userId);
        const batch = writeBatch(db);

        existingAddresses.forEach(addr => {
            const ref = doc(db, COLLECTION_NAME, addr.id);
            if (addr.id === addressId) {
                batch.update(ref, { isDefault: true, updatedAt: serverTimestamp() });
            } else if (addr.isDefault) {
                batch.update(ref, { isDefault: false, updatedAt: serverTimestamp() });
            }
        });

        await batch.commit();
    } catch (error) {
        console.error('Error setting default address:', error);
        throw error;
    }
}
