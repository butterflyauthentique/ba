'use client';

import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function TestAnalytics() {
  useEffect(() => {
    // Test Google Analytics
    if (window.gtag) {
      window.gtag('event', 'test_analytics_page_view', {
        page_title: 'Test Analytics',
        page_path: '/test-analytics',
      });
    }

    // Test Firebase Analytics
    if (analytics) {
      logEvent(analytics, 'test_analytics_page_view', {
        page_title: 'Test Analytics',
        page_path: '/test-analytics',
      });
    }
  }, []);

  const handleTestEvent = () => {
    // Test Google Analytics event
    if (window.gtag) {
      window.gtag('event', 'test_button_click', {
        event_category: 'test',
        event_label: 'Test Button',
      });
    }

    // Test Firebase Analytics event
    if (analytics) {
      logEvent(analytics, 'test_button_click', {
        category: 'test',
        label: 'Test Button',
      });
    }
    
    alert('Test event sent! Check your analytics dashboard.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Test Page</h1>
          <p className="text-lg text-gray-600 mb-8">
            This page is set up to test both Google Analytics and Firebase Analytics integration.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Analytics Events</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to send a test event to both Google Analytics and Firebase Analytics.
            </p>
            
            <button
              onClick={handleTestEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            >
              Send Test Event
            </button>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">How to verify:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-700">
                <li>Open your browser's developer tools (F12)</li>
                <li>Go to the "Network" tab</li>
                <li>Click the button above</li>
                <li>Look for requests to "google-analytics.com" or "firebase-analytics.com"</li>
                <li>Check your Google Analytics and Firebase Analytics dashboards for the test events</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Analytics Status</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Google Analytics</h3>
                <p className="text-sm text-gray-600">
                  Measurement ID: {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'Not configured'}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Firebase Analytics</h3>
                <p className="text-sm text-gray-600">
                  {typeof analytics !== 'undefined' ? 'Initialized and ready' : 'Not initialized'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
