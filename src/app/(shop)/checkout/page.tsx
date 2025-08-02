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
  Lock
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

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useHydratedStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
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
    
    // Free shipping for orders above ₹1000
    if (subtotal >= 1000) {
      return 0;
    }
    
    // Standard shipping cost for orders below ₹1000
    return 100;
  };

  // Calculate order totals
  const shippingCost = calculateShippingCost();
  const orderTotals = cart && products.length > 0 ? calculateOrderTotals(cart, products, shippingCost) : null;



  // Handle form input changes
  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.postalCode) {
      toast.error('Please complete your shipping address');
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

    setIsLoading(true);

    try {
      // Create Razorpay order
      const orderData = {
        amount: orderTotals.totalInPaise,
        currency: 'INR',
        receipt: `BA-${Date.now()}`,
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}`,
          contact: formData.phone,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        }
      };

      const orderResponse = await createRazorpayOrder(orderData);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay checkout
      const checkoutOrder: CheckoutOrder = {
        id: orderResponse.order.id,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        receipt: orderResponse.order.receipt,
        notes: orderData.notes,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#e12a47'
        }
      };

      const paymentResponse = await initializeRazorpayCheckout(checkoutOrder);
      
      // Verify payment
      const isVerified = await verifyPayment(paymentResponse);
      
      if (isVerified) {
        toast.success('Payment successful! Your order has been placed.');
        clearCart();
        router.push('/checkout/success');
      } else {
        toast.error('Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
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
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl font-bold text-gray-900">
              Checkout
            </h1>
            <div className="w-11"></div> {/* Spacer */}
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                    Shipping Details
                  </span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                    Payment
                  </span>
                </div>
              </div>
            </div>

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
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="input w-full"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="input w-full"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input w-full pl-10"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="input w-full pl-10"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="input w-full pl-10 resize-none"
                      rows={3}
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="input w-full"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="input w-full"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="input w-full"
                    placeholder="Enter postal code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="input w-full"
                    placeholder="Enter country"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="input w-full resize-none"
                    rows={3}
                    placeholder="Any special instructions for delivery"
                  />
                </div>
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
                      🎉 Free shipping on orders above ₹1000
                    </div>
                  )}
                  {orderTotals.shipping > 0 && orderTotals.subtotal < 1000 && (
                    <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
                      💡 Add ₹{1000 - orderTotals.subtotal} more for free shipping
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