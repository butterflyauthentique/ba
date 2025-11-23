import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';

/**
 * One-time migration function to backfill userId in old orders
 * Call this endpoint once: https://us-central1-butterflyauthentique33.cloudfunctions.net/migrateOrdersUserId
 */
export const migrateOrdersUserId = onRequest(async (req, res) => {
    try {
        console.log('🔄 Starting order migration...');

        const db = admin.firestore();

        // Get all orders without userId
        const ordersSnapshot = await db.collection('orders')
            .where('userId', '==', null)
            .get();

        console.log(`📦 Found ${ordersSnapshot.size} orders without userId`);

        let migratedCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (const orderDoc of ordersSnapshot.docs) {
            const order = orderDoc.data();

            // Skip if no customer email
            if (!order.customer?.email) {
                const msg = `Order ${orderDoc.id} has no customer email`;
                console.warn(`⚠️  ${msg}`);
                errors.push(msg);
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
                    const msg = `No user found for email: ${email} (Order: ${orderDoc.id})`;
                    console.warn(`⚠️  ${msg}`);
                    errors.push(msg);
                    errorCount++;
                    continue;
                }

                const userId = usersSnapshot.docs[0].id;

                // Update order with userId
                await orderDoc.ref.update({
                    userId: userId,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                console.log(`✅ Updated order ${orderDoc.id} with userId: ${userId}`);
                migratedCount++;

            } catch (error: any) {
                const msg = `Error processing order ${orderDoc.id}: ${error.message}`;
                console.error(`❌ ${msg}`);
                errors.push(msg);
                errorCount++;
            }
        }

        const summary = {
            success: true,
            migrated: migratedCount,
            errors: errorCount,
            total: ordersSnapshot.size,
            errorDetails: errors
        };

        console.log('📊 Migration Summary:', summary);

        return res.json(summary);

    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
