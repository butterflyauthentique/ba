import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { ServerProductService } from '@/lib/services/productService';
import { serializeProduct } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Fetch from Firestore using server-side service
  const product = await ServerProductService.getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found - Butterfly Authentique',
      description: 'The requested product could not be found.',
    };
  }

  const productUrl = `https://butterflyauthentique33.web.app/product/${product.slug || product.id}`;
  const productImage = typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || '/logo.png';
  const productDescription = product.metaDescription || product.description || `Discover ${product.name} - Handcrafted with love by Butterfly Authentique.`;

  return {
    title: product.metaTitle || `${product.name} - Butterfly Authentique`,
    description: productDescription,
    keywords: [
      product.name,
      product.category,
      product.subcategory,
      'handcrafted',
      'art',
      'jewelry',
      'paintings',
      'stoles',
      'Butterfly Authentique'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: product.metaTitle || product.name,
      description: productDescription,
      url: productUrl,
      siteName: 'Butterfly Authentique',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle || product.name,
      description: productDescription,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'INR',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
    },
  };
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const products = await ServerProductService.getProducts(); // Generate for all active products
    const params = [];
    
    for (const product of products) {
      // Generate params for both slug and ID to handle all possible URLs
      if (product.slug) {
        params.push({ id: product.slug });
      }
      if (product.id && product.id !== product.slug) {
        params.push({ id: product.id });
      }
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Use static generation for better performance
export const dynamic = 'auto';

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Fetch from Firestore using server-side service
  const product = await ServerProductService.getProduct(id);
  
  if (!product) {
    notFound();
  }

  // Serialize the product before passing to client component
  const serializedProduct = serializeProduct(product);

  return <ProductDetailClient product={serializedProduct} />;
} 