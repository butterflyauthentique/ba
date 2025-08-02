'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Phone, Mail, Clock } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-xl font-semibold text-gray-900">Privacy Policy</h1>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Lock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
                <p className="text-blue-800">
                  At Butterfly Authentique, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This policy explains how we collect, use, and safeguard your data.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.1 Personal Information</h3>
                  <p className="text-gray-700 mb-4">
                    We collect the following personal information when you interact with our website:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Name, email address, and phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely through Razorpay)</li>
                    <li>Order history and preferences</li>
                    <li>Account credentials (if you create an account)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.2 Technical Information</h3>
                  <p className="text-gray-700 mb-4">
                    We automatically collect certain technical information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent</li>
                    <li>Referral sources and search terms</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1.3 User-Generated Content</h3>
                  <p className="text-gray-700 mb-4">
                    We may collect content you provide:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Product reviews and ratings</li>
                    <li>Customer feedback and testimonials</li>
                    <li>Communications with our support team</li>
                    <li>Social media interactions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.1 Primary Uses</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send order confirmations and tracking updates</li>
                    <li>Process payments and prevent fraud</li>
                    <li>Improve our website and services</li>
                    <li>Personalize your shopping experience</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.2 Marketing Communications</h3>
                  <p className="text-gray-700 mb-4">
                    With your consent, we may use your information for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Sending promotional emails and newsletters</li>
                    <li>Notifying you about new products and offers</li>
                    <li>Running targeted advertising campaigns</li>
                    <li>Conducting customer surveys and research</li>
                  </ul>
                  <p className="text-gray-700">
                    You can opt out of marketing communications at any time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2.3 Legal and Security Purposes</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Comply with legal obligations and regulations</li>
                    <li>Protect against fraud and unauthorized access</li>
                    <li>Resolve disputes and enforce our terms</li>
                    <li>Maintain the security of our systems</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Service Providers</h3>
                  <p className="text-gray-700 mb-4">
                    We may share your information with trusted third-party service providers:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Payment processors (Razorpay) for secure transactions</li>
                    <li>Courier services for order delivery</li>
                    <li>Cloud hosting providers for data storage</li>
                    <li>Analytics services to improve our website</li>
                    <li>Customer support tools and platforms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Legal Requirements</h3>
                  <p className="text-gray-700 mb-4">
                    We may disclose your information when required by law:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>To comply with court orders or legal proceedings</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>To investigate potential violations of our terms</li>
                    <li>To prevent fraud or security threats</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 Business Transfers</h3>
                  <p className="text-gray-700">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, 
                    subject to the same privacy protections outlined in this policy.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Security Measures</h3>
                  <p className="text-gray-700 mb-4">
                    We implement comprehensive security measures to protect your information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure payment processing through Razorpay</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication measures</li>
                    <li>Data backup and disaster recovery procedures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Data Retention</h3>
                  <p className="text-gray-700 mb-4">
                    We retain your information for as long as necessary to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Provide our services and fulfill orders</li>
                    <li>Comply with legal and regulatory requirements</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Improve our services and user experience</li>
                  </ul>
                  <p className="text-gray-700">
                    When information is no longer needed, we securely delete or anonymize it.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.1 Access and Control</h3>
                  <p className="text-gray-700 mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Access and review your personal information</li>
                    <li>Update or correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Request data portability</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.2 Cookie Preferences</h3>
                  <p className="text-gray-700 mb-4">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Block or delete cookies</li>
                    <li>Set preferences for different types of cookies</li>
                    <li>Clear browsing data and cookies</li>
                    <li>Use incognito/private browsing mode</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">5.3 Marketing Opt-Out</h3>
                  <p className="text-gray-700">
                    To opt out of marketing communications:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Click the unsubscribe link in marketing emails</li>
                    <li>Update your preferences in your account settings</li>
                    <li>Contact us directly to request removal</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.1 Payment Processing</h3>
                  <p className="text-gray-700 mb-4">
                    We use Razorpay for secure payment processing. Razorpay's privacy policy governs how they handle your payment information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.2 Analytics and Advertising</h3>
                  <p className="text-gray-700 mb-4">
                    We may use third-party services for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Website analytics and performance monitoring</li>
                    <li>Advertising and remarketing campaigns</li>
                    <li>Social media integration and sharing</li>
                    <li>Customer feedback and review platforms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">6.3 External Links</h3>
                  <p className="text-gray-700">
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. 
                    Please review their privacy policies before providing any personal information.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
                If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be processed and stored in India or other countries where our service providers operate. 
                We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have questions about this privacy policy or our data practices, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Contact Us</p>
                      <p className="text-gray-700">Use our contact form below</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Response Time</p>
                      <p className="text-gray-700">Within 48 hours during business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Data Protection</p>
                      <p className="text-gray-700">All privacy inquiries handled through contact form</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Response Time:</strong> We aim to respond to privacy-related inquiries within 48 hours during business days.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Legal Basis and Compliance</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">11.1 Legal Basis</h3>
                  <p className="text-gray-700 mb-4">
                    We process your personal information based on:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Consent for marketing communications and optional features</li>
                    <li>Contract performance for order fulfillment and services</li>
                    <li>Legitimate interests for business operations and improvements</li>
                    <li>Legal obligations for compliance and security</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">11.2 Regulatory Compliance</h3>
                  <p className="text-gray-700 mb-4">
                    We comply with applicable data protection laws and regulations, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Information Technology Act, 2000 (India)</li>
                    <li>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</li>
                    <li>Digital Personal Data Protection Act, 2023 (when applicable)</li>
                    <li>General Data Protection Regulation (GDPR) for EU residents</li>
                  </ul>
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
              <Link href="/shipping-policy" className="text-red-600 hover:text-red-700 font-medium">
                Shipping & Delivery Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 