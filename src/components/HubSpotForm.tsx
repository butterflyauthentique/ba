'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    hbspt: any;
  }
}

export default function HubSpotForm() {
  useEffect(() => {
    // Load the HubSpot script
    const script = document.createElement('script');
    script.src = 'https://js-eu1.hsforms.net/forms/embed/146689577.js';
    script.async = true;
    script.defer = true;
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    
    // Create the form container
    const container = document.getElementById('hubspot-form');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
      
      // Initialize the form after the script loads
      script.onload = () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            region: 'eu1',
            portalId: '146689577',
            formId: '4d2736c1-e000-4ddb-b6c6-5b1fbd0fb4aa',
            target: '#hubspot-form',
          });
        }
      };
    }
    
    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div id="hubspot-form" className="w-full" />
    </div>
  );
}
