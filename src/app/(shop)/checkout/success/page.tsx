'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, ShoppingBag, Mail, Package, Printer, Calendar } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<{ orderId: string; orderNumber: string } | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const orderNumber = searchParams.get('orderNumber');

    if (orderId && orderNumber) {
      setOrderDetails({ orderId, orderNumber });
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrderData(orderDoc.data());
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculate estimated delivery (5-7 days from now)
  const getEstimatedDelivery = () => {
    const start = new Date();
    start.setDate(start.getDate() + 5);
    const end = new Date();
    end.setDate(end.getDate() + 7);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-IN', options)} - ${end.toLocaleDateString('en-IN', options)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none">
          <div className="p-8 text-center border-b border-gray-100">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 print:hidden">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Thank you for your order. We've received your payment and will start processing your order right away.
            </p>

            {/* Order Meta */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Order Number</span>
                <span className="font-semibold text-gray-900">{orderDetails?.orderNumber || 'N/A'}</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Date</span>
                <span className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Total Amount</span>
                <span className="font-semibold text-green-600">
                  ₹{orderData?.total?.toLocaleString('en-IN') || '0'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50/50">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {orderData?.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 bg-white p-3 rounded-lg border border-gray-100">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Shipping Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Delivery Information
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-3">
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                        <p className="text-sm text-gray-600">{getEstimatedDelivery()}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {orderData?.shippingAddress?.firstName} {orderData?.shippingAddress?.lastName}<br />
                          {orderData?.shippingAddress?.addressLine1}<br />
                          {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.state} - {orderData?.shippingAddress?.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm text-gray-600">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      You'll receive an order confirmation email shortly.
                    </li>
                    <li className="flex items-start text-sm text-gray-600">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      We'll pack and ship your order within 24 hours.
                    </li>
                    <li className="flex items-start text-sm text-gray-600">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      You'll get a tracking link via email/SMS once shipped.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 border-t border-gray-100 bg-gray-50 print:hidden">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orders"
                className="btn-primary flex items-center justify-center space-x-2 px-8 py-3"
              >
                <Package className="w-5 h-5" />
                <span>View My Orders</span>
              </Link>

              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center justify-center space-x-2 px-8 py-3"
              >
                <Printer className="w-5 h-5" />
                <span>Print Receipt</span>
              </button>

              <Link
                href="/shop"
                className="btn-outline flex items-center justify-center space-x-2 px-8 py-3"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-center print:hidden">
          <p className="text-sm text-gray-500">
            Need help with your order?{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 