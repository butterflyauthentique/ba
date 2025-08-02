import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/cart',
        '/checkout',
        '/login',
        '/register',
        '/forgot-password',
        '/test/',
      ],
    },
    sitemap: 'https://butterflyauthentique33.web.app/sitemap.xml',
  }
} 