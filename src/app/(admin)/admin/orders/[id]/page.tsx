'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    Truck,
    MapPin,
    CreditCard,
    Calendar,
    Mail,
    Phone,
    User,
    Printer,
    ExternalLink,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/database';
import {
    createShipmentAction,
    generateAWBAction,
    generateLabelAction,
    getTrackingAction,
    cancelShipmentAction
} from '@/app/actions/shiprocket';

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'orders', id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
            } else {
                toast.error('Order not found');
                router.push('/admin/orders');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShipment = async () => {
        if (!order) return;

        try {
            setProcessing(true);
            const result = await createShipmentAction(order);

            if (result.success && result.data) {
                toast.success('Shipment created successfully!');

                // Update local state and Firestore
                const shiprocketData = result.data;
                const updateData = {
                    'shiprocket.orderId': shiprocketData.order_id,
                    'shiprocket.shipmentId': shiprocketData.shipment_id,
                    'shiprocket.shipmentStatus': 'CREATED',
                    updatedAt: Timestamp.now()
                };

                await updateDoc(doc(db, 'orders', order.id), updateData);
                fetchOrder(); // Refresh data
            } else {
                toast.error(result.error || 'Failed to create shipment');
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            toast.error('An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const handleGenerateAWB = async () => {
        if (!order?.shiprocket?.shipmentId) return;

        try {
            setProcessing(true);
            const result = await generateAWBAction(order.shiprocket.shipmentId);

            if (result.success && result.data) {
                toast.success('AWB generated successfully!');

                const awbInfo = result.data.awb_assign_status === 1
                    ? result.data.response.data
                    : (result.data as any);

                const awbInfoAny = awbInfo as any;
                // Update Firestore with AWB details
                await updateDoc(doc(db, 'orders', order.id), {
                    'shiprocket.awbCode': awbInfoAny.awb_code,
                    'shiprocket.courierName': awbInfoAny.courier_name,
                    'shiprocket.courierCompanyId': awbInfoAny.courier_company_id,
                    'shiprocket.shipmentStatus': 'AWB_ASSIGNED',
                    status: 'processing', // Update main order status
                    updatedAt: Timestamp.now()
                });

                toast.success('AWB generated and saved!');
                fetchOrder();
                return;

                // (Removed – logic moved above)
            } else {
                toast.error(result.error || 'Failed to generate AWB');
            }
        } catch (error) {
            console.error('Error generating AWB:', error);
            toast.error('An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const handleDownloadLabel = async () => {
        if (!order?.shiprocket?.shipmentId) return;

        try {
            setProcessing(true);
            const result = await generateLabelAction(order.shiprocket.shipmentId);

            if (result.success && result.data && result.data.label_url) {
                window.open(result.data.label_url, '_blank');
            } else {
                toast.error(result.error || 'Failed to generate label');
            }
        } catch (error) {
            console.error('Error downloading label:', error);
            toast.error('An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const handleTrackOrder = async () => {
        if (!order?.shiprocket?.awbCode) return;

        try {
            setProcessing(true);
            const result = await getTrackingAction(order.shiprocket.awbCode);

            if (result.success) {
                // For now just show a toast, or redirect to tracking URL
                const trackingUrl = `https://shiprocket.co/tracking/${order.shiprocket.awbCode}`;
                window.open(trackingUrl, '_blank');
            } else {
                toast.error(result.error || 'Failed to get tracking info');
            }
        } catch (error) {
            console.error('Error tracking order:', error);
            toast.error('An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 lg:ml-64 overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Order #{order.orderNumber}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Placed on {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Items */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-gray-500" />
                                    Order Items
                                </h2>
                                <div className="divide-y divide-gray-200">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                                                    {item.productImage && (
                                                        <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    {item.variantName && (
                                                        <p className="text-sm text-gray-500">Variant: {item.variantName}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span>₹{order.shipping}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                        <span>Total</span>
                                        <span>₹{order.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping & Billing */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    Address Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                                        <div className="text-sm text-gray-900">
                                            <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                            <p>{order.shippingAddress.addressLine1}</p>
                                            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                            <p>{order.shippingAddress.postalCode}</p>
                                            <p>{order.shippingAddress.country}</p>
                                            <p className="mt-2">{order.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                    {order.billingAddress && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Billing Address</h3>
                                            <div className="text-sm text-gray-900">
                                                <p className="font-medium">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
                                                <p>{order.billingAddress.addressLine1}</p>
                                                {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                                                <p>{order.billingAddress.city}, {order.billingAddress.state}</p>
                                                <p>{order.billingAddress.postalCode}</p>
                                                <p>{order.billingAddress.country}</p>
                                                <p className="mt-2">{order.billingAddress.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Shiprocket Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-gray-500" />
                                    Shipping
                                </h2>

                                <div className="space-y-4">
                                    {/* Status Display */}
                                    {order.shiprocket?.shipmentStatus && (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Current Status</p>
                                            <p className="text-blue-900 font-semibold mt-1">{order.shiprocket.shipmentStatus}</p>
                                            {order.shiprocket.courierName && (
                                                <p className="text-sm text-blue-700 mt-1">via {order.shiprocket.courierName}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {!order.shiprocket?.orderId ? (
                                        <button
                                            onClick={handleCreateShipment}
                                            disabled={processing}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : 'Create Shipment'}
                                        </button>
                                    ) : !order.shiprocket?.awbCode ? (
                                        <button
                                            onClick={handleGenerateAWB}
                                            disabled={processing}
                                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : 'Generate AWB'}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleDownloadLabel}
                                                disabled={processing}
                                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                <Printer className="h-4 w-4" />
                                                Download Label
                                            </button>
                                            <button
                                                onClick={handleTrackOrder}
                                                disabled={processing}
                                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Track Shipment
                                            </button>
                                        </div>
                                    )}

                                    {order.shiprocket?.awbCode && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">AWB Number</p>
                                            <p className="font-mono text-sm font-medium text-gray-900">{order.shiprocket.awbCode}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    Customer
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customer.name}</p>
                                            <p className="text-sm text-gray-500">Customer</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {order.customer.email}
                                    </div>
                                    {order.customer.phone && (
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            {order.customer.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
