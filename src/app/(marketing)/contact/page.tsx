import { MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';

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


              </div>

              {/* Contact Form */}
              <div>
                <h2 className="font-secondary text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 