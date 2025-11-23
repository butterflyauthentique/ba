'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Search, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/adminAuth';
import { useHydratedStore } from '@/lib/store';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const { user, signOut, loading: authLoading } = useAuth();
  const { cart } = useHydratedStore();
  const pathname = usePathname();

  // Check admin status when user changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isAdmin(user);
        setIsUserAdmin(adminStatus);
      } else {
        setIsUserAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const cartItemCount = cart?.length || 0;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Butterfly Authentique"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Home
            </Link>
            <Link
              href="/shop?category=all"
              className={`text-sm font-medium transition-colors ${pathname.startsWith('/shop') ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              About
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${pathname.startsWith('/blog') ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {authLoading ? (
                // Loading skeleton
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  {/* Admin Panel Link */}
                  {isUserAdmin && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* User Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors">
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              <Link
                href="/"
                className={`block text-sm font-medium transition-colors ${pathname === '/' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`block text-sm font-medium transition-colors ${pathname === '/shop' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className={`block text-sm font-medium transition-colors ${pathname === '/about' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className={`block text-sm font-medium transition-colors ${pathname.startsWith('/blog') ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className={`block text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-rose-600' : 'text-gray-700 hover:text-rose-600'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Cart</span>
                  {cartItemCount > 0 && (
                    <span className="bg-rose-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile User Menu */}
              <div className="border-t border-gray-200 pt-4">
                {authLoading ? (
                  // Loading skeleton
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>

                    {/* Admin Panel Link */}
                    {isUserAdmin && (
                      <Link
                        href="/admin"
                        className="block text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 