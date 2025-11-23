'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Calendar, CreditCard, Truck } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '@/lib/auth';
import { Order } from '@/types/database';

export default function OrdersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) {
                setIsLoading(false);
                return;
            }

            try {
                const ordersRef = collection(db, 'orders');
                const q = query(
                    ordersRef,
                    where('customer.email', '==', user.email),
                    orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const fetchedOrders: Order[] = [];

                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
                });

                setOrders(fetchedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                        Sign In Required
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Please sign in to view your orders.
                    </p>
                    <Link href="/login" className="btn-primary">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="btn-icon bg-gray-100 text-gray-700 hover:bg-gray-200"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="font-serif text-xl font-bold text-gray-900">
                            My Orders
                        </h1>
                        <div className="w-10"></div> {/* Spacer for centering */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                            No Orders Yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            You haven&apos;t placed any orders yet. Start shopping to see your orders here!
                        </p>
                        <Link href="/shop" className="btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Order #{order.orderNumber || order.id}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(order.createdAt)}
                                            </span>
                                            <span className="flex items-center">
                                                <CreditCard className="w-4 h-4 mr-1" />
                                                ₹{order.total?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="space-y-2">
                                        {order.items?.slice(0, 2).map((item, index) => (
                                            <div key={index} className="flex items-center text-sm">
                                                <span className="text-gray-600">
                                                    {item.quantity}x {(item as any).name || item.productId}
                                                </span>
                                            </div>
                                        ))}
                                        {order.items && order.items.length > 2 && (
                                            <p className="text-sm text-gray-500">
                                                +{order.items.length - 2} more item(s)
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tracking Info */}
                                {order.trackingNumber && (
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Truck className="w-4 h-4 mr-2" />
                                            <span>Tracking: {order.trackingNumber}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
