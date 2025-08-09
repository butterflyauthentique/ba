import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from 'sitemap';
import { createGzip } from 'zlib';
import { Readable } from 'stream';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../src/lib/firebase';
import { Product } from '@/types/database';

// Base URL for your site
const SITE_URL = 'https://butterflyauthentique.in';

// Static pages that should be included in the sitemap
const staticPages: SitemapItemLoose[] = [
  { url: '/', changefreq: EnumChangefreq.DAILY, priority: 1.0 },
  { url: '/shop', changefreq: EnumChangefreq.DAILY, priority: 0.9 },
  { url: '/about', changefreq: EnumChangefreq.WEEKLY, priority: 0.8 },
  { url: '/contact', changefreq: EnumChangefreq.WEEKLY, priority: 0.7 },
  { url: '/privacy-policy', changefreq: EnumChangefreq.MONTHLY, priority: 0.5 },
  { url: '/terms', changefreq: EnumChangefreq.MONTHLY, priority: 0.5 },
  { url: '/shipping-policy', changefreq: EnumChangefreq.MONTHLY, priority: 0.5 },
  { url: '/refund-policy', changefreq: EnumChangefreq.MONTHLY, priority: 0.5 },
];

// Function to fetch all products from Firestore
async function fetchProducts(): Promise<Product[]> {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, 'id'>),
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

    const productLinks: SitemapItemLoose[] = products.map(product => ({
        url: `/product/${product.slug || product.id}`,
        changefreq: EnumChangefreq.WEEKLY,
        priority: 0.8,
        lastmod: product.updatedAt instanceof Timestamp 
            ? product.updatedAt.toDate().toISOString() 
            : new Date().toISOString(),
    }));

    const allLinks = [...staticPages, ...productLinks];

    // Pipe the links to the sitemap stream
    const sitemap = Readable.from(allLinks).pipe(stream);

    // Generate sitemap.xml.gz
    const sitemapPath = './public/sitemap.xml.gz';
    const writeStream = fs.createWriteStream(sitemapPath);
    const pipeline = sitemap.pipe(createGzip()).pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      pipeline.on('finish', () => resolve());
      pipeline.on('error', reject);
    });

    console.log(`Sitemap generated at ${sitemapPath}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
generateSitemap();
