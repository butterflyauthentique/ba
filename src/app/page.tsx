import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Star, ShoppingBag, Sparkles, Award, Shield, ChevronRight } from 'lucide-react';
import { ServerProductService } from '@/lib/services/productService';
import { Product } from '@/types/database';
  import { NewsletterSignup } from '@/components/forms/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Butterfly Authentique - Handcrafted Jewelry, Paintings & Stoles',
  description: 'Discover unique handcrafted jewelry, original paintings, and elegant stoles. Each piece tells a story of artistic excellence and cultural heritage.',
  keywords: 'handcrafted jewelry, paintings, stoles, art, Butterfly Authentique, handmade, authentic',
  openGraph: {
    title: 'Butterfly Authentique - Handcrafted Jewelry, Paintings & Stoles',
    description: 'Discover unique handcrafted jewelry, original paintings, and elegant stoles.',
    url: 'https://butterflyauthentique33.web.app',
    siteName: 'Butterfly Authentique',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Butterfly Authentique',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function HomePage() {
  const allProducts: Product[] = await ServerProductService.getProducts();
  const newArrivals: Product[] = allProducts.slice(0, 8);
  const categories: { key: string; label: string; href: string }[] = [
    { key: 'all', label: 'All', href: '/shop?category=all' },
    { key: 'jewelry', label: 'Jewelry', href: '/shop?category=jewelry' },
    { key: 'paintings', label: 'Paintings', href: '/shop?category=paintings' },
    { key: 'stoles', label: 'Stoles', href: '/shop?category=stoles' },
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section - 3 Section Layout */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Hero Content */}
        <div className="container relative z-10">
          {/* Main Hero Text (compact) */}
          <div className="text-center py-6 lg:py-8">
            <div className="mb-4 lg:mb-6">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Handcrafted with Love</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 lg:mb-4 drop-shadow-lg leading-tight">
                Butterfly{' '}
                <span className="text-yellow-300 font-serif">Authentique</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-4 lg:mb-5 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
                Handcrafted elegance meets artistic expression. Discover unique fashion jewelry, 
                paintings, and stoles that tell your story.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 lg:mb-8">
              <Link 
                href="/shop" 
                className="btn-primary bg-white text-red-600 border-white hover:bg-red-50 inline-flex items-center justify-center gap-2 shadow-lg px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/about" 
                className="btn-secondary bg-transparent text-white border-2 border-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Category chips (mobile-first) */}
          <div className="container relative z-10">
            <div className="-mx-4 px-4 pb-4">
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {categories.map((c) => (
                  <Link
                    key={c.key}
                    href={c.href}
                    className="whitespace-nowrap px-4 py-2 rounded-full text-sm bg-white/10 border border-white/20 hover:bg-white/15"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Hero Image Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-8 lg:pb-10">
            {/* Hero Section 1 - Paintings */}
            <Link href="/shop?category=paintings" className="group block">
              <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl">
                <div className="aspect-square relative">
                  {/* Hero Image */}
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/butterflyauthentique33.firebasestorage.app/o/Images%2FPainting_FlowerGirl_24x24_800x800.jpeg?alt=media&token=483c870b-bb19-4dc1-902d-3aed233d0f1a"
                    alt="Flower Girl Painting"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-center p-6 lg:p-8">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 drop-shadow-lg">
                        Art Collection
                      </h3>
                      <p className="text-white/90 text-sm lg:text-base">
                        Handcrafted Paintings
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Hero Section 2 - Jewelry */}
            <Link href="/shop?category=jewelry" className="group block">
              <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl">
                <div className="aspect-square relative">
                  {/* Hero Image */}
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/butterflyauthentique33.firebasestorage.app/o/Images%2FJewellery_Queen_800x800.jpg?alt=media&token=e0673c70-f98d-4b49-a26a-b14ed37abd9b"
                    alt="Queen Jewelry Collection"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-center p-6 lg:p-8">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 drop-shadow-lg">
                        Jewelry Collection
                      </h3>
                      <p className="text-white/90 text-sm lg:text-base">
                        Handcrafted Elegance
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Hero Section 3 - Stoles */}
            <Link href="/shop?category=stoles" className="group block">
              <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl">
                <div className="aspect-square relative">
                  {/* Hero Image */}
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/butterflyauthentique33.firebasestorage.app/o/Images%2FStole_Dancing_Girl_800x800_01.jpg?alt=media&token=8ffbbb1c-5e88-45a3-a8c4-19c098406619"
                    alt="Dancing Girl Stole"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-center p-6 lg:p-8">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 drop-shadow-lg">
                        Accessories Collection
                      </h3>
                      <p className="text-white/90 text-sm lg:text-base">
                        Elegant Stoles
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRight className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8 text-white/80 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-300" />
              </div>
              <span className="text-sm font-medium text-center">Handcrafted</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-300" />
              </div>
              <span className="text-sm font-medium text-center">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-300" />
              </div>
              <span className="text-sm font-medium text-center">Secure Shopping</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals band above the fold continuation */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">New Arrivals</h2>
            <Link href="/shop" className="text-red-600 hover:text-red-700 font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((p) => (
              <Link href={`/product/${p.slug || p.id}`} key={p.id} className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={typeof p.images?.[0] === 'string' ? (p.images?.[0] as any) : (p.images?.[0]?.url || '/logo.png')}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={false}
                  />
                </div>
                <div className="mt-2">
                  <div className="text-[10px] sm:text-xs text-red-600 font-medium uppercase tracking-wider">{p.category}</div>
                  <div className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">{p.name}</div>
                  <div className="text-sm sm:text-base text-gray-700">₹{(p.price || 0).toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Categories
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              From elegant jewelry to stunning paintings, discover the perfect piece for your collection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Jewelry Category */}
            <Link href="/shop?category=jewelry" className="group block">
              <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="aspect-square relative">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/butterflyauthentique33.firebasestorage.app/o/Images%2FJewelry.jpg?alt=media&token=0de95ed0-4f7b-4b1f-b74f-33e577b4e1eb"
                    alt="Jewelry Collection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">Jewelry</h3>
                    <p className="text-white/90 text-sm lg:text-base">Handcrafted Elegance</p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Paintings Category */}
            <Link href="/shop?category=paintings" className="group block">
              <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="aspect-square relative">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/butterflyauthentique33.firebasestorage.app/o/Images%2FPainting_Ashwini.jpg?alt=media&token=b3b44fcb-8070-4714-9c62-e24918153eef"
                    alt="Paintings Collection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">Paintings</h3>
                    <p className="text-white/90 text-sm lg:text-base">Artistic Masterpieces</p>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Stoles Category */}
            <Link href="/shop?category=stoles" className="group block">
              <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                <div className="aspect-square relative">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/butterflyauthentique33.firebasestorage.app/o/Images%2FStole.jpg?alt=media&token=1a1ec3ce-c765-489f-b7dd-5aa9b1ea618e"
                    alt="Stoles Collection"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">Stoles</h3>
                    <p className="text-white/90 text-sm lg:text-base">Elegant Accessories</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Discover Your Perfect Piece?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have found their unique style with Butterfly Authentique.
          </p>
          {/* Inline email capture */}
          <div className="max-w-xl mx-auto mb-8">
            <NewsletterSignup />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="btn-primary bg-white text-red-600 border-white hover:bg-red-50 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Start Shopping
            </Link>
            <Link 
              href="/about" 
              className="btn-secondary bg-transparent text-white border-2 border-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
