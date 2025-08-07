'use client';

import { logEvent, EventParams } from 'firebase/analytics';
import { analytics } from './firebase';

// Track page views
export const trackPageView = (url: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, {
      page_path: url,
    });
  }

  // Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: url,
      page_title: document.title,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, params?: EventParams) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Firebase Analytics
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

// Track user sign up
export const trackSignUp = (method: string) => {
  trackEvent('sign_up', { method });
};

// Track login
export const trackLogin = (method: string) => {
  trackEvent('login', { method });
};

// Track product view
export const trackProductView = (productId: string, productName: string) => {
  trackEvent('view_item', {
    items: [{
      item_id: productId,
      item_name: productName,
    }],
  });
};

// Track add to cart
export const trackAddToCart = (productId: string, productName: string, value: number) => {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value,
    items: [{
      item_id: productId,
      item_name: productName,
    }],
  });
};

// Track purchase
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency: 'INR',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

// Track search
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};
