'use client';

import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin, Package, AlertCircle, CheckCircle, Phone, Mail } from 'lucide-react';

export default function ShippingPolicyPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Shipping & Delivery Policy</h1>
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
              <Truck className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping & Delivery Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                <p className="text-blue-800">
                  Due to the handcrafted nature of our products, processing times may vary. 
                  We ensure each piece meets our quality standards before shipping.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Processing Time</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.1 Order Processing</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Ready-to-Ship Items</p>
                          <p className="text-sm text-gray-600">2-3 business days</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900">Handcrafted Items</p>
                          <p className="text-sm text-gray-600">3-5 business days</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">Custom Orders</p>
                          <p className="text-sm text-gray-600">7-14 business days</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">Limited Edition</p>
                          <p className="text-sm text-gray-600">5-7 business days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.2 Processing Factors</h3>
                  <p className="text-gray-700 mb-4">
                    Processing time may be affected by:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Product complexity and handcrafting requirements</li>
                    <li>Current order volume and artisan availability</li>
                    <li>Quality control and final inspection processes</li>
                    <li>Customization requests and special requirements</li>
                    <li>Holiday periods and seasonal demand</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Shipping Methods & Delivery Timeline</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Domestic Shipping (India)</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Standard Delivery</h4>
                          <span className="text-sm font-medium text-gray-600">₹150</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Metro Cities</p>
                            <p className="text-gray-600">3-5 business days</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Tier 2 Cities</p>
                            <p className="text-gray-600">5-7 business days</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Other Locations</p>
                            <p className="text-gray-600">7-10 business days</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Express Delivery</h4>
                          <span className="text-sm font-medium text-gray-600">₹300</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Metro Cities</p>
                            <p className="text-gray-600">1-2 business days</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Tier 2 Cities</p>
                            <p className="text-gray-600">2-3 business days</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Other Locations</p>
                            <p className="text-gray-600">3-5 business days</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Premium Delivery</h4>
                          <span className="text-sm font-medium text-gray-600">₹500</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Metro Cities</p>
                            <p className="text-gray-600">Same day/Next day</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Tier 2 Cities</p>
                            <p className="text-gray-600">1-2 business days</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Other Locations</p>
                            <p className="text-gray-600">2-3 business days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Free Shipping</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">🎉 Free Standard Shipping on Orders Above ₹2,000</h4>
                    <p className="text-green-800 text-sm">
                      Orders above ₹2,000 qualify for free standard delivery across India. 
                      Express and premium delivery options are available at additional cost.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Delivery Timeline Summary</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Order Processing:</span>
                    <span className="font-medium text-gray-900">2-5 business days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Standard Shipping:</span>
                    <span className="font-medium text-gray-900">3-10 business days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Express Shipping:</span>
                    <span className="font-medium text-gray-900">1-5 business days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Premium Shipping:</span>
                    <span className="font-medium text-gray-900">Same day - 3 business days</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Total Delivery Time:</span>
                      <span className="font-bold text-red-600">5-15 business days</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">(Standard shipping, including processing)</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Shipping Partners & Tracking</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Shipping Partners</h3>
                  <p className="text-gray-700 mb-4">
                    We partner with reliable courier services to ensure safe and timely delivery:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>DTDC Express Limited</li>
                    <li>Blue Dart Express</li>
                    <li>Delhivery</li>
                    <li>Professional Couriers</li>
                    <li>Local courier services for remote areas</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Order Tracking</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      Once your order is shipped, you will receive:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      <li>Shipping confirmation email with tracking number</li>
                      <li>SMS updates on delivery status</li>
                      <li>Real-time tracking through our website</li>
                      <li>Delivery notification and proof of delivery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Delivery Areas & Restrictions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.1 Delivery Coverage</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-900 mb-2">✅ We Deliver To:</h4>
                    <ul className="list-disc pl-6 text-green-800 space-y-1">
                      <li>All major cities and towns across India</li>
                      <li>Metro cities with same-day delivery options</li>
                      <li>Tier 2 and Tier 3 cities</li>
                      <li>Most rural areas (subject to courier availability)</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">⚠️ Limited Service Areas:</h4>
                    <ul className="list-disc pl-6 text-yellow-800 space-y-1">
                      <li>Remote villages and tribal areas</li>
                      <li>Restricted military zones</li>
                      <li>Areas with security restrictions</li>
                      <li>International destinations (not currently available)</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.2 Address Requirements</h3>
                  <p className="text-gray-700 mb-4">
                    To ensure smooth delivery, please provide:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Complete and accurate delivery address</li>
                    <li>Landmark or nearby location details</li>
                    <li>Correct PIN code</li>
                    <li>Alternate contact number</li>
                    <li>Preferred delivery time (if applicable)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Delivery Process & Requirements</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.1 Delivery Process</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Order Processing</p>
                        <p className="text-gray-700">Quality check and packaging of handcrafted items</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Shipping</p>
                        <p className="text-gray-700">Handover to courier partner with tracking details</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <p className="font-medium text-gray-900">In Transit</p>
                        <p className="text-gray-700">Real-time tracking updates via email and SMS</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</div>
                      <div>
                        <p className="font-medium text-gray-900">Delivery</p>
                        <p className="text-gray-700">Hand delivery with OTP verification</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.2 Delivery Requirements</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">📦 Delivery Requirements:</h4>
                    <ul className="list-disc pl-6 text-blue-800 space-y-1">
                      <li>Recipient must be present at delivery address</li>
                      <li>Valid ID proof may be required for high-value orders</li>
                      <li>OTP verification for orders above ₹5,000</li>
                      <li>Package inspection before accepting delivery</li>
                      <li>Signature required for proof of delivery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Failed Deliveries & Redelivery</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">7.1 Failed Delivery Scenarios</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4">
                    <li>Recipient not available at delivery address</li>
                    <li>Incorrect or incomplete address</li>
                    <li>Area not accessible by courier</li>
                    <li>Security restrictions or gated communities</li>
                    <li>Weather conditions affecting delivery</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">7.2 Redelivery Policy</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">First Redelivery Attempt:</span>
                        <span className="font-medium text-gray-900">Free</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Second Redelivery Attempt:</span>
                        <span className="font-medium text-gray-900">₹100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Third Redelivery Attempt:</span>
                        <span className="font-medium text-gray-900">₹200</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">After 3 attempts:</span>
                        <span className="font-medium text-red-600">Return to sender</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  For shipping and delivery inquiries, please contact us:
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
                    <strong>Note:</strong> For tracking inquiries, please have your order number ready. 
                    We respond to all shipping queries within 24 hours during business days.
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
              <Link href="/refund-policy" className="text-red-600 hover:text-red-700 font-medium">
                Refund & Cancellation Policy
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