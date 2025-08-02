'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function TestPage() {
  const { cart, addToCart } = useAppStore();

  const testLogin = (isAdmin: boolean) => {
    toast.success(`Login functionality moved to Firebase Auth - ${isAdmin ? 'Admin' : 'User'} mode`);
  };

  const testAddToCart = () => {
    addToCart({
      productId: 'test-product-1',
      quantity: 1,
      price: 1000,
      name: 'Test Product',
      image: ''
    });
    toast.success('Added test product to cart');
  };

  const clearUser = () => {
    toast.success('Logout functionality moved to Firebase Auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="font-secondary text-3xl font-bold text-gray-900 mb-8">
            🧪 Functionality Test Page
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Authentication Tests */}
            <div className="space-y-6">
              <h2 className="font-secondary text-xl font-bold text-gray-900">
                🔐 Authentication Tests
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Current Status:</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Authentication:</strong> Moved to Firebase Auth
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => testLogin(false)}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    Login as Regular User
                  </button>
                  <button
                    onClick={() => testLogin(true)}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    Login as Admin
                  </button>
                  <button
                    onClick={clearUser}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Tests */}
            <div className="space-y-6">
              <h2 className="font-secondary text-xl font-bold text-gray-900">
                🛒 Cart Tests
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Cart Status:</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Items in Cart:</strong> {cart?.length || 0}
                  </p>
                  {cart && cart.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 font-semibold">Items:</p>
                      {cart.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          • Product {item.productId}: {item.quantity} qty
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={testAddToCart}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    Add Test Product to Cart
                  </button>
                  <Link href="/cart" className="btn-secondary w-full flex items-center justify-center">
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tests */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="font-secondary text-xl font-bold text-gray-900 mb-6">
              🧭 Navigation Tests
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/" className="btn-secondary text-center">
                Home
              </Link>
              <Link href="/shop" className="btn-secondary text-center">
                Shop
              </Link>
              <Link href="/cart" className="btn-secondary text-center">
                Cart
              </Link>
              <Link href="/login" className="btn-secondary text-center">
                Login
              </Link>
              <Link href="/register" className="btn-secondary text-center">
                Register
              </Link>
              <Link href="/about" className="btn-secondary text-center">
                About
              </Link>
              <Link href="/contact" className="btn-secondary text-center">
                Contact
              </Link>
              <Link href="/admin" className="btn-secondary text-center">
                Admin
              </Link>
            </div>
          </div>

          {/* Admin Tests */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="font-secondary text-xl font-bold text-gray-900 mb-6">
              👑 Admin Tests
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/admin" className="btn-primary text-center">
                Dashboard
              </Link>
              <Link href="/admin/products" className="btn-primary text-center">
                Products
              </Link>
              <Link href="/admin/orders" className="btn-primary text-center">
                Orders
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="font-secondary text-xl font-bold text-gray-900 mb-4">
              📋 Testing Instructions
            </h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to Test:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Click &quot;Login as Regular User&quot; to test customer features</li>
                <li>Click &quot;Login as Admin&quot; to test admin panel access</li>
                <li>Add items to cart and test cart functionality</li>
                <li>Navigate to different pages using the navigation buttons</li>
                <li>Test the admin panel features when logged in as admin</li>
                <li>Check that the favicon appears in browser tabs</li>
                <li>Test responsive design on different screen sizes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 