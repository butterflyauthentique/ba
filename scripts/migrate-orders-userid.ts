/**
 * Migration Script: Backfill userId in Old Orders
 * 
 * This script adds the userId field to old orders that don't have it
 * by matching customer.email with the users collection.
 * 
 * Run this ONCE after deploying the /myorders userId fix.
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

async function migrateOrders() {
    console.log('🔄 Starting order migration...');

    try {
        // Get all orders
        const ordersSnapshot = await db.collection('orders').get();
        console.log(`📦 Found ${ordersSnapshot.size} total orders`);

        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const orderDoc of ordersSnapshot.docs) {
            const order = orderDoc.data();

            // Skip if userId already exists
            if (order.userId) {
                skippedCount++;
                continue;
            }

            // Skip if no customer email
            if (!order.customer?.email) {
                console.warn(`⚠️  Order ${orderDoc.id} has no customer email, skipping`);
                errorCount++;
                continue;
            }

            try {
                // Find user by email (case-insensitive)
                const email = order.customer.email.toLowerCase();
                const usersSnapshot = await db.collection('users')
                    .where('email', '==', email)
                    .limit(1)
                    .get();

                if (usersSnapshot.empty) {
                    console.warn(`⚠️  No user found for email: ${email} (Order: ${orderDoc.id})`);
                    errorCount++;
                    continue;
                }

                const userId = usersSnapshot.docs[0].id;

                // Update order with userId
                await orderDoc.ref.update({
                    userId: userId,
                    updatedAt: new Date()
                });

                console.log(`✅ Updated order ${orderDoc.id} with userId: ${userId}`);
                migratedCount++;

            } catch (error) {
                console.error(`❌ Error processing order ${orderDoc.id}:`, error);
                errorCount++;
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`✅ Migrated: ${migratedCount}`);
        console.log(`⏭️  Skipped (already had userId): ${skippedCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📦 Total: ${ordersSnapshot.size}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run migration
migrateOrders()
    .then(() => {
        console.log('✅ Migration completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
