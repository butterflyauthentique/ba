import { Send, Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-amber-50 py-20">
        <div className="container text-center">
          <h1 className="font-secondary text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="font-secondary text-3xl font-bold text-gray-900 mb-8">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a 
                        href="mailto:butterflyauthentique@gmail.com" 
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        butterflyauthentique@gmail.com
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a 
                        href="tel:+919823614953" 
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        +91 98236 14953
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Available Monday to Friday, 9 AM - 6 PM IST
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                        Saturday: 10:00 AM - 4:00 PM IST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-600">
                        Based in India<br />
                        Serving customers worldwide through our online platform
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Need Immediate Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    For urgent inquiries about orders or products, please call us directly during business hours.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online orders available 24/7</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="font-secondary text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label required">First Name</label>
                      <input type="text" className="input" placeholder="Your first name" />
                    </div>
                    <div>
                      <label className="label required">Last Name</label>
                      <input type="text" className="input" placeholder="Your last name" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="label required">Email</label>
                    <input type="email" className="input" placeholder="your.email@example.com" />
                  </div>
                  
                  <div>
                    <label className="label">Phone</label>
                    <input type="tel" className="input" placeholder="Your phone number" />
                  </div>
                  
                  <div>
                    <label className="label required">Subject</label>
                    <select className="input">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Status</option>
                      <option value="product">Product Information</option>
                      <option value="support">Customer Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label required">Message</label>
                    <textarea 
                      className="input" 
                      rows={5} 
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 