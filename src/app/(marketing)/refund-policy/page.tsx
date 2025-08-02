'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw, X, Clock, AlertCircle, CheckCircle, Phone, Mail } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Refund & Cancellation Policy</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <RefreshCw className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund & Cancellation Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                <p className="text-blue-800">
                  Due to the handcrafted nature of our products, each piece is unique and made specifically for you. 
                  Please read this policy carefully to understand our refund and cancellation terms.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Cancellation Policy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.1 Order Cancellation Timeline</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Within 24 hours</p>
                          <p className="text-sm text-gray-600">Full refund available</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900">24-48 hours</p>
                          <p className="text-sm text-gray-600">50% refund available</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">After 48 hours</p>
                          <p className="text-sm text-gray-600">No cancellation possible</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.2 Cancellation Process</h3>
                  <p className="text-gray-700 mb-4">
                    To cancel your order, please contact us immediately:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Use our contact form below</li>
                    <li>Include your order number and reason for cancellation</li>
                  </ul>
                  <p className="text-gray-700">
                    Cancellation requests are processed within 24 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Refund Policy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Refund Eligibility</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-900 mb-2">✅ Eligible for Refund:</h4>
                    <ul className="list-disc pl-6 text-green-800 space-y-1">
                      <li>Damaged products received</li>
                      <li>Significant quality issues</li>
                      <li>Wrong product delivered</li>
                      <li>Size/measurement issues (if applicable)</li>
                      <li>Order cancelled within 24 hours</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">❌ Not Eligible for Refund:</h4>
                    <ul className="list-disc pl-6 text-red-800 space-y-1">
                      <li>Change of mind after 24 hours</li>
                      <li>Minor color variations (handcrafted nature)</li>
                      <li>Size preferences (unless significantly different from description)</li>
                      <li>Products used, worn, or altered</li>
                      <li>Custom/made-to-order items (unless defective)</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Refund Timeline</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Refund Request Processing:</span>
                        <span className="font-medium text-gray-900">2-3 business days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Bank Processing Time:</span>
                        <span className="font-medium text-gray-900">5-7 business days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Total Refund Time:</span>
                        <span className="font-medium text-red-600">7-10 business days</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.3 Refund Methods</h3>
                  <p className="text-gray-700 mb-4">
                    Refunds will be processed through the original payment method:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Credit/Debit Cards: Refunded to the same card</li>
                    <li>UPI: Refunded to the same UPI ID</li>
                    <li>Net Banking: Refunded to the same bank account</li>
                    <li>Digital Wallets: Refunded to the same wallet</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Return Process</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Return Requirements</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">📦 Return Conditions:</h4>
                    <ul className="list-disc pl-6 text-yellow-800 space-y-1">
                      <li>Product must be unused and in original condition</li>
                      <li>Original packaging must be intact</li>
                      <li>All tags and labels must be attached</li>
                      <li>Return request must be made within 7 days of delivery</li>
                      <li>Return shipping is customer's responsibility</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Return Process Steps</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Contact Customer Support</p>
                        <p className="text-gray-700">Email or call us with your order number and return reason</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Get Return Authorization</p>
                        <p className="text-gray-700">We'll provide a return authorization number and shipping address</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Ship the Product</p>
                        <p className="text-gray-700">Package securely and ship to our return address</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</div>
                      <div>
                        <p className="font-medium text-gray-900">Refund Processing</p>
                        <p className="text-gray-700">Once received and inspected, refund will be processed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Special Considerations for Handcrafted Products</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Handcrafted Variations</h3>
                  <p className="text-gray-700 mb-4">
                    Our products are handcrafted by skilled artisans, which means:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Slight variations in color, size, and design are natural and expected</li>
                    <li>Each piece is unique and may differ slightly from product images</li>
                    <li>These variations do not constitute defects and are not grounds for refund</li>
                    <li>We celebrate these variations as they add to the authentic, handmade character</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Custom Orders</h3>
                  <p className="text-gray-700 mb-4">
                    For custom or made-to-order items:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>No cancellation once production begins</li>
                    <li>Refunds only for significant quality issues</li>
                    <li>Production time varies based on complexity</li>
                    <li>Custom orders are non-returnable unless defective</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Limited Edition Items</h3>
                  <p className="text-gray-700 mb-4">
                    Limited edition and one-of-a-kind pieces:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Strict 24-hour cancellation policy</li>
                    <li>No returns unless defective</li>
                    <li>These items cannot be recreated or replaced</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  For refund and cancellation requests, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Contact Support</p>
                      <p className="text-gray-700">Use our contact form below</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Response Time</p>
                      <p className="text-gray-700">Within 24 hours during business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <p className="text-gray-700">Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> For faster resolution, please include your order number, 
                    product details, and clear photos (if applicable) when contacting us.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/terms" className="text-red-600 hover:text-red-700 font-medium">
                Terms & Conditions
              </Link>
              <Link href="/shipping-policy" className="text-red-600 hover:text-red-700 font-medium">
                Shipping & Delivery Policy
              </Link>
              <Link href="/privacy-policy" className="text-red-600 hover:text-red-700 font-medium">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 