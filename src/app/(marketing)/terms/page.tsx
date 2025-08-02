'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, FileText, Clock, Truck, CreditCard, Phone, Mail } from 'lucide-react';

export default function TermsPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Terms & Conditions</h1>
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
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Butterfly Authentique's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. About Butterfly Authentique</h2>
              <p className="text-gray-700 mb-4">
                Butterfly Authentique is a handcrafted products business specializing in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Handmade fashion jewelry</li>
                <li>Original paintings and artwork</li>
                <li>Embroidered silk stoles</li>
                <li>Other handcrafted accessories and home decor items</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All our products are handcrafted by skilled artisans, ensuring unique, one-of-a-kind pieces that celebrate artistic excellence and cultural heritage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Handcrafted Nature</h3>
                  <p className="text-gray-700">
                    All products are handcrafted, which means slight variations in color, size, and design may occur. These variations are natural and add to the unique character of each piece.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Product Images</h3>
                  <p className="text-gray-700">
                    Product images are representative of the actual items. Due to lighting conditions and monitor settings, actual colors may vary slightly from what appears on your screen.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 Availability</h3>
                  <p className="text-gray-700">
                    Product availability is subject to change. Some items may be limited in quantity due to their handcrafted nature. We reserve the right to discontinue any product without prior notice.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pricing and Payment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Pricing</h3>
                  <p className="text-gray-700">
                    All prices are displayed in Indian Rupees (₹) and include applicable taxes. Prices are subject to change without prior notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Payment Methods</h3>
                  <p className="text-gray-700">
                    We accept payments through Razorpay, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Credit and debit cards</li>
                    <li>Net banking</li>
                    <li>UPI payments</li>
                    <li>Digital wallets</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Payment Security</h3>
                  <p className="text-gray-700">
                    All payments are processed securely through Razorpay. We do not store your payment information on our servers.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Order Processing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.1 Order Confirmation</h3>
                  <p className="text-gray-700">
                    Upon successful payment, you will receive an order confirmation email with your order details and tracking information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.2 Order Processing Time</h3>
                  <p className="text-gray-700">
                    Due to the handcrafted nature of our products, order processing may take 2-5 business days before shipping.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.3 Order Cancellation</h3>
                  <p className="text-gray-700">
                    Orders can be cancelled within 24 hours of placement, subject to our cancellation policy outlined in our Refund & Cancellation Policy.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Accounts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.1 Account Creation</h3>
                  <p className="text-gray-700">
                    You may create an account to access certain features. You are responsible for maintaining the confidentiality of your account information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.2 Account Security</h3>
                  <p className="text-gray-700">
                    You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Butterfly Authentique and is protected by Indian copyright laws.
              </p>
              <p className="text-gray-700 mb-4">
                Our handcrafted designs are original creations. Reproduction or copying of our designs without permission is strictly prohibited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Butterfly Authentique shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
              </p>
              <p className="text-gray-700 mb-4">
                Our total liability to you for any claims shall not exceed the amount you paid for the specific product giving rise to the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>


          </div>

          {/* Footer Links */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/refund-policy" className="text-red-600 hover:text-red-700 font-medium">
                Refund & Cancellation Policy
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