import type { Metadata } from 'next';

import { Inter } from 'next/font/google'
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/structuredData';
import AnalyticsWrapper from '@/components/analytics/AnalyticsWrapper';
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/lib/auth'
import { Toaster } from 'react-hot-toast'
import Analytics from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Butterfly Authentique - Handcrafted Jewelry, Paintings & Stoles',
  description: 'Discover unique handcrafted jewelry, original paintings, and elegant stoles. Each piece tells a story of artistic excellence and cultural heritage.',
  keywords: 'handcrafted jewelry, paintings, stoles, art, Butterfly Authentique, handmade, authentic',
  authors: [{ name: 'Butterfly Authentique' }],
  creator: 'Butterfly Authentique',
  publisher: 'Butterfly Authentique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://butterflyauthentique33.web.app'),
  alternates: {
    canonical: '/',
  },
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
  twitter: {
    card: 'summary_large_image',
    title: 'Butterfly Authentique - Handcrafted Jewelry, Paintings & Stoles',
    description: 'Discover unique handcrafted jewelry, original paintings, and elegant stoles.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// Add type for window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data
  const organizationStructuredData = generateOrganizationStructuredData();
  const websiteStructuredData = generateWebsiteStructuredData();

  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body className={inter.className}>
        <AnalyticsWrapper />
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
