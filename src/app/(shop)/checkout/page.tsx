'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  X,
  Loader2
} from 'lucide-react';
import { useHydratedStore } from '@/lib/store';
import { productService } from '@/lib/firebase';
import {
  createRazorpayOrder,
  initializeRazorpayCheckout,
  verifyPayment,
  calculateOrderTotals,
  formatCurrency,
  CheckoutOrder,
  PaymentResponse
} from '@/lib/razorpay';
import { isValidEmail, isValidPhone, formatPhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';
import { submitHubSpotForm } from '@/lib/hubspot';
import { useAuth } from '@/lib/auth';
import { getSavedAddresses, saveAddress } from '@/lib/savedAddresses';
import { SavedAddress } from '@/types/database';

// Indian States and Union Territories
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Format phone number for display (98765 43210)
const formatPhoneDisplay = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
};

// Strip phone formatting for validation/submission
const stripPhoneFormatting = (value: string): string => {
  return value.replace(/\D/g, '');
};

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface FieldErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useHydratedStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: ''
  });

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const allProducts = await productService.getAll();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products for checkout:', error);
        toast.error('Failed to load product information');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate shipping cost based on cart total
  const calculateShippingCost = () => {
    if (!cart || cart.length === 0) return 0;

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      const price = product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    // Free shipping for orders above ₹900
    if (subtotal >= 900) {
      return 0;
    }

    // Standard shipping cost for orders below ₹900
    return 200;
  };

  // Calculate order totals
  const shippingCost = calculateShippingCost();
  const orderTotals = cart && products.length > 0 ? calculateOrderTotals(cart, products, shippingCost) : null;



  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Lookup city/state from postal code
  const lookupPostalCode = async (pincode: string) => {
    if (pincode.length !== 6) return;

    setIsCheckingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice.District;
        const state = postOffice.State;

        setFormData(prev => ({
          ...prev,
          city: city,
          state: state,
          country: 'India'
        }));

        // Clear errors for city/state if they exist
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.city;
          delete newErrors.state;
          return newErrors;
        });

        toast.success(`Location found: ${city}, ${state}`);
      }
    } catch (error) {
      console.error('Error looking up pincode:', error);
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Load saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (user) {
        setIsLoadingAddresses(true);
        try {
          const addresses = await getSavedAddresses(user.id);
          setSavedAddresses(addresses);
        } catch (error) {
          console.error('Error loading saved addresses:', error);
        } finally {
          setIsLoadingAddresses(false);
        }
      }
    };

    loadAddresses();
  }, [user]);

  // Handle saved address selection
  const handleAddressSelect = (address: SavedAddress) => {
    setFormData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: formatPhoneDisplay(address.phone),
      address: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country
    }));

    // Set selected address ID for visual feedback
    setSelectedAddressId(address.id);

    // Clear all errors
    setFieldErrors({});

    toast.success('Address applied');
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    // Clear selected address when user manually edits
    if (selectedAddressId) {
      setSelectedAddressId(null);
    }

    // Apply phone formatting for display
    if (field === 'phone') {
      const formatted = formatPhoneDisplay(value);
      setFormData(prev => ({ ...prev, [field]: formatted }));
    }
    // Handle postal code changes
    else if (field === 'postalCode') {
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [field]: cleaned }));

      if (cleaned.length === 6) {
        lookupPostalCode(cleaned);
      }
    }
    else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form with field-level errors
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (Indian format: 10 digits)
    const cleanPhone = stripPhoneFormatting(formData.phone);
    if (!cleanPhone) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    // State validation
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    // Postal code validation (Indian format: 6 digits)
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      errors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    // Country validation
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    setFieldErrors(errors);

    // If there are errors, focus on the first error field
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error(`Please fix the errors in the form`);
      return false;
    }

    return true;
  };

  // Handle payment
  const handlePayment = async () => {
    if (!cart || !orderTotals) {
      toast.error('Cart is empty');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Save address if checked
    if (user && saveAddressChecked) {
      try {
        await saveAddress(user.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: stripPhoneFormatting(formData.phone),
          addressLine1: formData.address,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          label: 'Home', // Default label
          isDefault: savedAddresses.length === 0
        });
      } catch (error) {
        console.error('Error saving address:', error);
        // Don't block payment on address save error
      }
    }

    setIsLoading(true);

    try {
      // Create Razorpay order
      const orderData = {
        amount: orderTotals.totalInPaise,
        currency: 'INR',
        receipt: `BA-${Date.now()}`,


      };

      const orderResponse = await createRazorpayOrder(orderData);

      if (!orderResponse.success) {
        throw new Error('Failed to create order');
      }

      // Newsletter opt-in (non-blocking, before opening gateway)
      if (newsletterOptIn && isValidEmail(formData.email)) {
        submitHubSpotForm({
          portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
          formGuid: process.env.NEXT_PUBLIC_HUBSPOT_NEWSLETTER_FORM_ID || '',
          fields: [
            { name: 'email', value: formData.email },
            { name: 'firstname', value: formData.firstName },
            { name: 'lastname', value: formData.lastName },
          ],
        }).catch((e) => console.warn('Newsletter opt-in failed (non-blocking):', e));
      }

      // Initialize Razorpay checkout
      const checkoutOrder: CheckoutOrder = {
        id: orderResponse.order.id,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        receipt: orderResponse.order.receipt,

        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: stripPhoneFormatting(formData.phone)
        },
        theme: {
          color: '#e12a47'
        }
      };

      // Debug: Log the exact payload being sent to Razorpay
      console.log('🔍 Razorpay Checkout Order:', JSON.stringify(checkoutOrder, null, 2));
      console.log('🔍 Contact (stripped):', stripPhoneFormatting(formData.phone));
      console.log('🔍 Contact length:', stripPhoneFormatting(formData.phone).length);

      const paymentResponse = await initializeRazorpayCheckout(checkoutOrder);

      console.log('🎯 Payment response received:', paymentResponse);

      // Verify payment with timeout
      const verificationPromise = verifyPayment(paymentResponse);
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.log('⏰ Payment verification timeout - assuming success');
          resolve(true);
        }, 10000); // 10 second timeout
      });

      const isVerified = await Promise.race([verificationPromise, timeoutPromise]);

      console.log('🎯 Payment verification result:', isVerified);

      if (isVerified) {
        toast.success('Payment successful! Your order has been placed.');
        clearCart();
        router.push('/checkout/success');
      } else {
        // Payment verification failed
        const errorParams = new URLSearchParams({
          error_code: 'VERIFICATION_FAILED',
          error_description: 'Payment verification failed. Please try again.',
          error_step: 'verification'
        });
        router.push(`/checkout/failure?${errorParams.toString()}`);
      }
    } catch (error: any) {
      console.error('Payment error:', error);

      // Handle specific error types
      let errorCode = 'PAYMENT_FAILED';
      let errorDescription = 'Payment failed. Please try again.';
      let errorStep = 'payment';

      if (error.message?.includes('declined')) {
        errorCode = 'PAYMENT_DECLINED';
        errorDescription = 'Your payment was declined. Please try a different payment method.';
      } else if (error.message?.includes('insufficient')) {
        errorCode = 'INSUFFICIENT_FUNDS';
        errorDescription = 'Insufficient funds. Please check your balance.';
      } else if (error.message?.includes('expired')) {
        errorCode = 'CARD_EXPIRED';
        errorDescription = 'Your card has expired. Please use a different card.';
      } else if (error.message?.includes('invalid')) {
        errorCode = 'INVALID_CARD';
        errorDescription = 'Invalid card details. Please check and try again.';
      } else if (error.message?.includes('network')) {
        errorCode = 'NETWORK_ERROR';
        errorDescription = 'Network error occurred. Please check your connection and try again.';
      } else if (error.message?.includes('timeout')) {
        errorCode = 'TIMEOUT';
        errorDescription = 'Payment request timed out. Please try again.';
      } else if (error.message?.includes('gateway')) {
        errorCode = 'GATEWAY_ERROR';
        errorDescription = 'Payment gateway error. Please try again later.';
      }

      const errorParams = new URLSearchParams({
        error_code: errorCode,
        error_description: errorDescription,
        error_step: errorStep
      });

      router.push(`/checkout/failure?${errorParams.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  // If no cart, redirect to shop (but only if we're not already loading)
  useEffect(() => {
    if (!isLoadingProducts && (!cart || cart.length === 0)) {
      router.push('/shop');
    }
  }, [cart, router, isLoadingProducts]);

  // Show loading state while fetching products
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
            <h1 className="font-secondary text-2xl font-bold text-gray-900 mb-4">
              Loading Checkout...
            </h1>
            <p className="text-gray-600">
              Please wait while we load your order details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if cart is empty or still loading
  if (isLoadingProducts || !cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="btn-icon bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl font-bold text-gray-900">
              Checkout
            </h1>
            <button
              onClick={() => router.push('/shop')}
              className="btn-icon bg-gray-100 text-gray-700 hover:bg-gray-200"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    1
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                    Shipping Details
                  </span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                    Payment
                  </span>
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            {user && savedAddresses.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-gray-900">
                      Saved Addresses
                    </h2>
                    <p className="text-sm text-gray-600">
                      Select a saved address to auto-fill
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all relative group ${selectedAddressId === addr.id
                        ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
                        }`}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{addr.firstName} {addr.lastName}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{addr.addressLine1}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-sm text-gray-600 mt-1">{formatPhoneDisplay(addr.phone)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    Shipping Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Enter your delivery details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`input w-full ${fieldErrors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`input w-full ${fieldErrors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`input w-full pl-10 ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.email}
                    </p>
                  )}
                  <label className="mt-3 flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    />
                    <span>
                      Send me updates, new arrivals and offers. Unsubscribe anytime. See our{' '}
                      <a href="/privacy-policy" className="underline text-red-600" target="_blank" rel="noreferrer">Privacy Policy</a>.
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`input w-full pl-10 ${fieldErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter 10-digit phone number"
                      maxLength={11}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`input w-full pl-10 ${fieldErrors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="House/Flat No., Street Name, Area"
                    />
                  </div>
                  {fieldErrors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.address}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    className="input w-full"
                    placeholder="Landmark, Building/Complex Name (Optional)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Add nearby landmark or building name for easier delivery
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`input w-full ${fieldErrors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter city"
                  />
                  {fieldErrors.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`input w-full ${fieldErrors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.state && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.state}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`input w-full ${fieldErrors.postalCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter 6-digit postal code"
                      maxLength={6}
                    />
                    {isCheckingPincode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      </div>
                    )}
                  </div>
                  {fieldErrors.postalCode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.postalCode}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`input w-full ${fieldErrors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter country"
                  />
                  {fieldErrors.country && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.country}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="input w-full resize-none"
                    rows={3}
                    placeholder="Any special instructions for delivery"
                  />
                </div>

                {/* Save Address Checkbox */}
                {user && (
                  <div className="md:col-span-2 mt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddressChecked}
                        onChange={(e) => setSaveAddressChecked(e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Save this address for future orders</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                  <p className="text-sm text-gray-600">
                    Review your items
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;



                  return (
                    <div key={item.productId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={
                            product.featuredImage ||
                            (Array.isArray(product.images) && product.images.length > 0
                              ? (typeof product.images[0] === 'string'
                                ? product.images[0]
                                : product.images[0]?.url || '/logo.png')
                              : '/logo.png')
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">
                Order Total
              </h2>

              {orderTotals ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal (GST Included)</span>
                    <span className="text-gray-900">{formatCurrency(orderTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`${orderTotals.shipping === 0 ? 'text-green-600 font-semibold' : 'text-gray-900'}`}>
                      {orderTotals.shipping === 0 ? 'FREE' : formatCurrency(orderTotals.shipping)}
                    </span>
                  </div>
                  {orderTotals.shipping === 0 && (
                    <div className="text-xs text-green-600 text-center bg-green-50 p-2 rounded">
                      🎉 Free shipping on orders above ₹900
                    </div>
                  )}
                  {orderTotals.shipping > 0 && orderTotals.subtotal < 900 && (
                    <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
                      💡 Add ₹{900 - orderTotals.subtotal} more for free shipping
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-red-600">{formatCurrency(orderTotals.total)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    * All prices include 18% GST
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal (GST Included)</span>
                    <span className="text-gray-900">₹0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Calculating...</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-red-600">Calculating...</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    * All prices include 18% GST
                  </div>
                </div>
              )}

              {/* Security Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>Multiple Payment Options</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading || !orderTotals}
                className="w-full btn-primary mt-6 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay {orderTotals ? formatCurrency(orderTotals.total) : '₹0'}</span>
                  </>
                )}
              </button>

              {/* Payment Methods */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">We accept</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold">UPI</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold">Card</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold">Net</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold">Wallets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 