import { Metadata } from 'next';
import { Suspense } from 'react';
import ShopPageClient from './ShopPageClient';
import { ServerProductService } from '@/lib/services/productService';
import { serializeProduct } from '@/lib/utils';
import Loading from '@/app/loading';

export const metadata: Metadata = {
  title: 'Shop - Butterfly Authentique',
  description: 'Discover our handcrafted jewelry, paintings, and stoles. Each piece tells a unique story.',
  keywords: 'handcrafted jewelry, paintings, stoles, art, Butterfly Authentique',
  openGraph: {
    title: 'Shop - Butterfly Authentique',
    description: 'Discover our handcrafted jewelry, paintings, and stoles.',
    url: 'https://butterflyauthentique33.web.app/shop',
    siteName: 'Butterfly Authentique',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Butterfly Authentique Shop',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function ShopPage() {
  // Fetch products server-side for better SEO and initial load
  const products = await ServerProductService.getProducts();
  
  // Serialize products for client component
  const serializedProducts = products.map(serializeProduct);
  
  return (
    <Suspense fallback={<Loading />}>
      <ShopPageClient products={serializedProducts} />
    </Suspense>
  );
} 