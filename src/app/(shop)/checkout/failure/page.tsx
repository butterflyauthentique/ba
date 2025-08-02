'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, Home, ShoppingBag, RefreshCw, AlertTriangle } from 'lucide-react';
import { useHydratedStore } from '@/lib/store';

function CheckoutFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart } = useHydratedStore();
  const [errorDetails, setErrorDetails] = useState<{
    code?: string;
    description?: string;
    source?: string;
    step?: string;
  }>({});

  useEffect(() => {
    // Get error details from URL parameters
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    const errorSource = searchParams.get('error_source');
    const errorStep = searchParams.get('error_step');

    setErrorDetails({
      code: errorCode || undefined,
      description: errorDescription || undefined,
      source: errorSource || undefined,
      step: errorStep || undefined
    });
  }, [searchParams]);

  const getErrorMessage = () => {
    if (errorDetails.description) {
      return errorDetails.description;
    }
    
    switch (errorDetails.code) {
      case 'PAYMENT_DECLINED':
        return 'Your payment was declined. Please try a different payment method.';
      case 'INSUFFICIENT_FUNDS':
        return 'Insufficient funds in your account. Please check your balance.';
      case 'CARD_EXPIRED':
        return 'Your card has expired. Please use a different card.';
      case 'INVALID_CARD':
        return 'Invalid card details. Please check and try again.';
      case 'NETWORK_ERROR':
        return 'Network error occurred. Please check your connection and try again.';
      case 'TIMEOUT':
        return 'Payment request timed out. Please try again.';
      default:
        return 'Payment failed. Please try again or contact support if the issue persists.';
    }
  };

  const getErrorIcon = () => {
    switch (errorDetails.code) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
        return <RefreshCw className="w-10 h-10 text-orange-600" />;
      default:
        return <XCircle className="w-10 h-10 text-red-600" />;
    }
  };

  const getErrorColor = () => {
    switch (errorDetails.code) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-red-100 text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Failure Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className={`w-20 h-20 ${getErrorColor().split(' ')[0]} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {getErrorIcon()}
          </div>

          {/* Error Message */}
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>

          {/* Error Details (if available) */}
          {errorDetails.code && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Error Code</span>
                <span className="font-mono text-gray-900">{errorDetails.code}</span>
              </div>
              {errorDetails.step && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Failed At</span>
                  <span className="font-semibold text-gray-900">{errorDetails.step}</span>
                </div>
              )}
            </div>
          )}

          {/* Troubleshooting Tips */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Check Payment Method</p>
                <p className="text-xs text-gray-600">Ensure your card/bank details are correct</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Verify Balance</p>
                <p className="text-xs text-gray-600">Make sure you have sufficient funds</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Try Again</p>
                <p className="text-xs text-gray-600">Sometimes temporary issues resolve on retry</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {cart && cart.length > 0 && (
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Payment Again</span>
              </button>
            )}
            
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
              className="w-full btn-outline flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">
              Still having issues? Contact our support team
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs">
              <Link 
                href="/contact" 
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your cart items are still saved. You can retry the payment anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-6"></div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-4">
              Loading...
            </h1>
            <p className="text-gray-600">
              Please wait while we load the error details.
            </p>
          </div>
        </div>
      </div>
    }>
      <CheckoutFailureContent />
    </Suspense>
  );
} 