'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, ShoppingBag, Mail, Package } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<{ orderId: string; orderNumber: string } | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId') || '';
    const orderNumber = searchParams.get('orderNumber') || '';
    setOrderDetails({ orderId, orderNumber });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We&apos;ve received your payment and will start processing your order right away.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Order Number</span>
              <span className="font-semibold text-gray-900">
                {orderDetails?.orderNumber || 'Processing...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Payment Status</span>
              <span className="text-green-600 font-semibold">Paid</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Order Confirmation</p>
                <p className="text-xs text-gray-600">You&apos;ll receive an email confirmation shortly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Order Processing</p>
                <p className="text-xs text-gray-600">We&apos;ll start preparing your order within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Shipping Updates</p>
                <p className="text-xs text-gray-600">You&apos;ll get tracking information once shipped</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/orders"
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>View My Orders</span>
            </Link>

            <Link
              href="/shop"
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <Link
              href="/"
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">
              Need help? Contact our support team
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <Link
                href="/contact"
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            A copy of your order confirmation has been sent to{' '}
            <span className="font-medium text-gray-700">
              your email
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 