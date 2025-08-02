// Razorpay Configuration and Utilities
import { loadScript } from './utils';

// Razorpay configuration from environment variables
const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_AaXoLwVs0isbmk";

// Debug configuration in development
if (typeof window !== 'undefined') {
  console.log('🔧 [Client] Razorpay Configuration:', {
    keyId: keyId,
    isProduction: keyId.startsWith('rzp_live_'),
    env: process.env.NODE_ENV
  });
}

export const razorpayConfig = {
  keyId: keyId,
  // Note: keySecret is only used server-side in API routes
};

// Order interface for checkout
export interface CheckoutOrder {
  id: string;
  amount: number; // Amount in paise (smallest currency unit)
  currency: string;
  receipt: string;
  notes: {
    address: string;
    contact: string;
    name: string;
    email: string;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

// Payment success response
export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Load Razorpay script
export const loadRazorpay = async (): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const razorpay = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    return razorpay;
  } catch (error) {
    console.error('Failed to load Razorpay:', error);
    throw new Error('Payment gateway not available');
  }
};

// Create Razorpay order
export const createRazorpayOrder = async (orderData: {
  amount: number;
  currency: string;
  receipt: string;
  notes: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const response = await fetch('https://us-central1-butterflyauthentique33.cloudfunctions.net/createRazorpayOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment signature
export const verifyPayment = async (paymentData: PaymentResponse): Promise<boolean> => {
  try {
    const response = await fetch('https://us-central1-butterflyauthentique33.cloudfunctions.net/verifyRazorpayPayment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data.verified;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

// Initialize Razorpay checkout
export const initializeRazorpayCheckout = async (order: CheckoutOrder): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const razorpay = await loadRazorpay(); // eslint-disable-line @typescript-eslint/no-unused-vars
  
  const options = {
    key: razorpayConfig.keyId,
    amount: order.amount,
    currency: order.currency,
    name: 'Butterfly Authentique',
    description: 'Handcrafted Elegance',
    image: '/android-chrome-192x192.png',
    order_id: order.id,
    handler: function (response: PaymentResponse) {
      // Handle payment success
      console.log('Payment successful:', response);
      return response;
    },
    prefill: order.prefill,
    notes: order.notes,
    theme: {
      color: '#e12a47', // Butterfly Authentique brand color
    },
    // Payment method restrictions
    config: {
      display: {
        blocks: {
          banks: {
            name: 'Pay using UPI',
            instruments: [
              {
                method: 'upi'
              }
            ]
          },
          cards: {
            name: 'Pay using Cards',
            instruments: [
              {
                method: 'card'
              }
            ]
          },
          netbanking: {
            name: 'Pay using Net Banking',
            instruments: [
              {
                method: 'netbanking'
              }
            ]
          },
          wallets: {
            name: 'Pay using Wallets',
            instruments: [
              {
                method: 'wallet'
              }
            ]
          }
        },
        sequence: ['block.banks', 'block.cards', 'block.netbanking', 'block.wallets'],
        preferences: {
          show_default_blocks: false
        }
      }
    },
    modal: {
      ondismiss: function() {
        // Handle modal dismissal
        console.log('Payment modal dismissed');
      }
    },
    // Add error handling for security headers
    retry: {
      enabled: true,
      max_count: 3
    },
    // Suppress console errors for security headers
    suppress_console_errors: true
  };

  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay(options); // eslint-disable-line @typescript-eslint/no-explicit-any
    
    rzp.on('payment.failed', function (response: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Payment failed:', response.error);
      reject(new Error(response.error.description || 'Payment failed'));
    });

    rzp.on('payment.success', function (response: PaymentResponse) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.log('Payment success event triggered:', response);
      resolve(response);
    });

    // Add error handling for initialization
    rzp.on('payment.error', function (response: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Payment error:', response.error);
      reject(new Error(response.error.description || 'Payment error occurred'));
    });

    try {
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay modal:', error);
      reject(new Error('Failed to open payment gateway'));
    }
  });
};

// Calculate order totals
export const calculateOrderTotals = (items: any[], products: any[], shippingCost: number = 0, taxRate: number = 0.18) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  // Calculate subtotal (prices already include GST)
  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    const price = product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  // Since prices already include GST, we don't add additional tax
  const tax = 0; // No additional GST charged to customer
  const shipping = shippingCost;
  const total = subtotal + shipping; // Total is subtotal + shipping (GST already included in prices)

  return {
    subtotal,
    tax,
    shipping,
    total,
    totalInPaise: Math.round(total * 100) // Convert to paise for Razorpay
  };
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'INR') => {
  // Handle NaN and invalid amounts
  if (isNaN(amount) || !isFinite(amount)) {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}; 