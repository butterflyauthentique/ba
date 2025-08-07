import { Product } from '@/types/database';

export function generateProductStructuredData(product: Product) {
  const { id, name, description, price, images, category, createdAt, updatedAt } = product;
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: name,
    description: description,
    image: images?.[0] || '',
    sku: id,
    mpn: id,
    brand: {
      '@type': 'Brand',
      name: 'Butterfly Authentique'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${id}`,
      priceCurrency: 'INR',
      price: price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1'
    }
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Butterfly Authentique',
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.item
    }))
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Butterfly Authentique',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    description: 'Handcrafted jewelry, original paintings, and elegant stoles. Each piece tells a story of artistic excellence and cultural heritage.',
    sameAs: [
      'https://www.facebook.com/butterflyauthentique',
      'https://www.instagram.com/butterflyauthentique',
      'https://www.pinterest.com/butterflyauthentique'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
      email: 'contact@butterflyauthentique.com',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi']
    }
  };
}
