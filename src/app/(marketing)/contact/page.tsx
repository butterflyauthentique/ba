import { Send } from 'lucide-react'

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

      {/* Contact Form Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
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
      </section>
    </div>
  )
} 