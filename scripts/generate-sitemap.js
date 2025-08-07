const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const { Readable } = require('stream');
const { collection, getDocs } = require('firebase/firestore');
const { db } = require('../src/lib/firebase');

// Base URL for your site
const SITE_URL = 'https://butterflyauthentique33.web.app';

// Static pages that should be included in the sitemap
const staticPages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/shop', changefreq: 'daily', priority: 0.9 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'weekly', priority: 0.7 },
  { url: '/privacy-policy', changefreq: 'monthly', priority: 0.5 },
  { url: '/terms', changefreq: 'monthly', priority: 0.5 },
  { url: '/shipping-policy', changefreq: 'monthly', priority: 0.5 },
  { url: '/refund-policy', changefreq: 'monthly', priority: 0.5 },
];

// Function to fetch all products from Firestore
async function fetchProducts() {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Generate sitemap
async function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    // Fetch dynamic content
    const products = await fetchProducts();
    
    // Create sitemap stream
    const stream = new SitemapStream({ hostname: SITE_URL });
    
    // Create a readable stream from the sitemap
    const sitemap = Readable.from([
      // Add static pages
      ...staticPages,
      // Add product pages
      ...products.map(product => ({
        url: `/product/${product.slug || product.id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
      })),
    ]).pipe(stream);

    // Generate sitemap.xml
    const sitemapPath = './public/sitemap.xml';
    const writeStream = fs.createWriteStream(sitemapPath);
    const pipeline = sitemap.pipe(createGzip()).pipe(writeStream);
    
    await new Promise((resolve, reject) => {
      pipeline.on('finish', resolve);
      pipeline.on('error', reject);
    });

    console.log(`Sitemap generated at ${sitemapPath}`);
    
    // Generate sitemap index if needed (for large sites)
    // This is a simplified version, you might need to adjust based on your needs
    if (products.length > 1000) {
      const sitemapIndexPath = './public/sitemap-index.xml';
      const sitemapIndexStream = new SitemapStream({ hostname: SITE_URL });
      
      // Split products into chunks of 1000
      const chunks = [];
      for (let i = 0; i < products.length; i += 1000) {
        chunks.push(products.slice(i, i + 1000));
      }
      
      // Generate sitemap index
      const indexStream = Readable.from([
        { url: '/sitemap.xml', changefreq: 'daily', priority: 1.0 },
        ...chunks.map((_, index) => ({
          url: `/sitemap-${index + 1}.xml`,
          changefreq: 'daily',
          priority: 0.9,
        })),
      ]).pipe(sitemapIndexStream);
      
      const writeIndexStream = fs.createWriteStream(sitemapIndexPath);
      const indexPipeline = indexStream.pipe(createGzip()).pipe(writeIndexStream);
      
      await new Promise((resolve, reject) => {
        indexPipeline.on('finish', resolve);
        indexPipeline.on('error', reject);
      });
      
      console.log(`Sitemap index generated at ${sitemapIndexPath}`);
    }
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
generateSitemap();
