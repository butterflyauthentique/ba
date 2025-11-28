
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkRecentOrders() {
    try {
        console.log('🔍 Checking recent orders...');
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('❌ No orders found.');
            return;
        }

        console.log(`✅ Found ${snapshot.size} recent orders:\n`);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`Order ID: ${doc.id}`);
            console.log(`Order Number: ${data.orderNumber}`);
            console.log(`Date: ${new Date(data.createdAt.seconds * 1000).toLocaleString()}`);
            console.log(`Customer: ${data.customer?.email}`);
            console.log(`Total: ${data.total}`);
            console.log(`Shiprocket Order ID: ${data.shiprocketOrderId || 'N/A'}`);
            console.log('-----------------------------------');
        });

    } catch (error) {
        console.error('❌ Error fetching orders:', error);
    }
}

checkRecentOrders();
