'use client';

import { useState } from 'react';
import { Heart, Star, Users, Instagram, Facebook, Youtube, Mail, Phone } from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('butterfly');

  const tabs = [
    { id: 'butterfly', label: 'About Butterfly Authentique' },
    { id: 'ashwini', label: 'About Ashwini A. Nanal' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-amber-50 py-20">
        <div className="container text-center">
          <h1 className="font-secondary text-5xl font-bold text-gray-900 mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where artistry, authenticity, and style gracefully meet. 
            Discover the artists behind our beautiful creations.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4 py-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="section bg-white">
        <div className="container max-w-4xl">
          {/* About Butterfly Authentique */}
          {activeTab === 'butterfly' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-secondary text-4xl font-bold text-gray-900 mb-4">
                  About Butterfly Authentique
                </h2>
                <p className="text-lg text-gray-600">
                  Welcome to Butterfly Authentique, where artistry, authenticity, and style gracefully meet. 
                  Founded in Cullera, Valencia, we are passionate about curating and creating exquisite 
                  handmade fashion jewelry, delicate stoles, and original canvas paintings that celebrate 
                  the beauty of individuality.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                    Our Story
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Butterfly Authentique was born from a love of self-expression and creative craftsmanship. 
                    Inspired by the transformative magic of the butterfly, our brand is devoted to uplifting 
                    your everyday style with pieces that tell genuine stories – crafted by hand, with heart.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Every accessory and artwork in our collection is thoughtfully designed and meticulously made, 
                    blending fine artistry with timeless fashion. We believe that style is a form of self-expression, 
                    and every piece should help you share your unique spark with the world.
                  </p>
                </div>

                <div>
                  <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We&apos;re on a mission to champion artful individuality. Our handmade creations aim to inspire 
                    confidence, empower the artist in everyone, and bring moments of joy to daily life. By sourcing 
                    quality materials and supporting local artists, we ensure each piece radiates both quality and 
                    positive energy.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                  Meet the Artists
                </h3>
                <p className="text-gray-600 mb-4">
                  At Butterfly Authentique, we shine a light on real artists—the hands and hearts behind each 
                  beautiful creation. Our team brings together traditional craftsmanship and modern inspiration, 
                  honoring heritage while exploring new creative frontiers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h4 className="font-secondary text-xl font-bold text-gray-900 mb-2">
                    Authenticity at Heart
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Each item is handcrafted in small batches—never mass-produced.
                  </p>
                </div>

                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h4 className="font-secondary text-xl font-bold text-gray-900 mb-2">
                    Distinctive Design
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Every piece is made to stand out and feel special, whether worn or displayed.
                  </p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-secondary text-xl font-bold text-gray-900 mb-2">
                    Customer Connection
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We cherish every relationship, offering attentive service and sharing the stories behind our work.
                  </p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="text-center pt-8 border-t border-gray-200">
                <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                  Follow Our Journey
                </h3>
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://www.instagram.com/butterflyauthentique" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.facebook.com/butterflyauthentique/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.youtube.com/@butterflyauthentique" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* About Ashwini A. Nanal */}
          {activeTab === 'ashwini' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="font-secondary text-4xl font-bold text-gray-900 mb-4">
                  About Ashwini A. Nanal
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p className="text-lg">Born 1978. Pune. India</p>
                  <p className="text-lg font-medium">B. F. A. (Applied Art)</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-8 mb-8">
                <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                  Ashwini Says…
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    I&apos;ve always liked to paint happiness, Sweetness, love, freshness and beauty of life on my canvas.
                  </p>
                  <p>
                    These things nourishes our any relationship…whether its Mother and child, Friends or Husband Wife…
                  </p>
                  <p>
                    I love myself very much…which is why I can love my family and people around me.
                  </p>
                  <p>
                    My emotions, positivity and nature has inspired me a lot to paint…
                  </p>
                  <p>
                    I&apos;ve been always very much attracted to the Nature and Nature&apos;s Sweetness and always wondering 
                    about Nature&apos;s beautiful creations and giving Quality.
                  </p>
                  <p>
                    Every time I find pure and beautiful creations in nature…
                  </p>
                  <p>
                    Change is a very beautiful process in nature that inspires me to learn and keep negative things 
                    aside and do a fresh start every day.
                  </p>
                  <p className="font-medium text-lg">
                    Flow like a river, feel like a sea and be steady like rocks and mountains with a sense of belief 
                    in yourself…that&apos;s my motto in life !!!
                  </p>
                  <p>
                    Just be happy and beautify yourself just like nature and life so that you can make others happy…
                  </p>
                  <p>
                    There is so much pain and happiness in day to day life, it totally depends on us what we choose 
                    and go ahead …I choose sweetness, positivity, happiness, brightness, strength, freshness of life 
                    in my journey…so its more easier to handle our life wisely and stay steady and positive..
                  </p>
                  <p>
                    Always love to paint brighter side of life..and making walls more brighter and happier with my 
                    paintings..when your walls are happy, cheerful and dancing so that you..
                  </p>
                  <p>
                    Its my strong wish that I can paint till my last breath and will make this world more colorful 
                    and more beautiful day by day..
                  </p>
                  <p>
                    My Paintings are my reflection…I always follow my heart…And being an Artist is wonderful thing in my life…
                  </p>
                  <p>
                    when we are with Full of Love, Positivity, Sweetness, Freshness, Purity so there is no space 
                    for negative things in our life, then and then we can stay light, Pure, Calm and happy…
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                    Paintings Medium
                  </h3>
                  <p className="text-lg text-gray-600 font-medium">Acrylic on Canvas</p>
                </div>

                <div>
                  <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
                    Exhibitions
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>2016 : Nehru Centre, Mumbai</p>
                    <p>2016 : Malaka Spice, Pune</p>
                    <p>2015 : Darpan Art Gallery, Pune</p>
                    <p>2015 : Darpan Art Gallery, Pune</p>
                    <p>2013 : Darpan Art Gallery, Pune</p>
                    <p>2013 : Malaka Spice, Pune</p>
                    <p>2011 : Malaka Spice, Pune</p>
                    <p>2010 : Malaka Spice, Pune</p>
                    <p>2009 : Malaka Spice, Pune</p>
                    <p>2009 : Art 2day, Pune</p>
                    <p>2008 : Empress Garden, Pune</p>
                    <p>2008 : Rotary club, Balgandharva, Pune</p>
                    <p>2007 : Concern Foundation, Balgandharva</p>
                    <p>2006 : Balgandharva, Pune</p>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-gray-50">
        <div className="container max-w-4xl text-center">
          <h2 className="font-secondary text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            People willing to buy paintings or buy Indian paintings love Ashwini&apos;s work. 
            Clients approach her to buy paintings online from all over the globe. Many people claim 
            her paintings as the best Buddha paintings available today.
          </p>
          
          <div className="bg-white rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
            <h3 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h3>
            <p className="text-gray-600 mb-6">
              Have questions about our paintings or want to place a custom order? 
              We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3"
              >
                Contact Us
              </a>
              <a 
                href="/shop" 
                className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-3"
              >
                Explore Our Collection
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 