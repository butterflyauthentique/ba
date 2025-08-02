'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/adminAuth';
import Link from 'next/link';

export default function TestAdminPage() {
  const { user, loading } = useAuth();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        setAdminCheckLoading(true);
        const adminStatus = await isAdmin(user);
        setIsUserAdmin(adminStatus);
        setAdminCheckLoading(false);
      } else {
        setIsUserAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Authentication Test</h1>
          
          <div className="space-y-6">
            {/* Authentication Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
              <div className="space-y-2">
                <p><strong>Logged In:</strong> {user ? 'Yes' : 'No'}</p>
                {user && (
                  <>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                  </>
                )}
              </div>
            </div>

            {/* Admin Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Status</h2>
              <div className="space-y-2">
                {adminCheckLoading ? (
                  <p>Checking admin status...</p>
                ) : (
                  <>
                    <p><strong>Is Admin:</strong> {isUserAdmin ? 'Yes' : 'No'}</p>
                    {user && user.email === 'butterfly.auth@gmail.com' && (
                      <p className="text-green-600 font-medium">✅ Super Admin Account Detected</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-4">
                {!user ? (
                  <div className="space-y-2">
                    <p className="text-gray-600">You need to log in to access admin features.</p>
                    <div className="flex space-x-4">
                      <Link
                        href="/login"
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                ) : isUserAdmin ? (
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✅ You have admin access!</p>
                    <div className="flex space-x-4">
                      <Link
                        href="/admin"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Go to Admin Panel
                      </Link>
                      <Link
                        href="/admin/admins"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Manage Admins
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-red-600 font-medium">❌ You don't have admin access.</p>
                    <p className="text-gray-600">
                      Only users with admin privileges can access the admin panel.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Access Admin Panel</h2>
              <div className="space-y-2 text-blue-800">
                <p>1. <strong>Create Admin Account:</strong> Use the script in <code>scripts/create-admin-account.js</code></p>
                <p>2. <strong>Sign In:</strong> Go to <Link href="/login" className="underline">/login</Link> and use <code>butterfly.auth@gmail.com</code></p>
                <p>3. <strong>Verify Email:</strong> Check your email and verify the account</p>
                <p>4. <strong>Access Admin Panel:</strong> You'll see "Admin Panel" in the navigation</p>
                <p>5. <strong>Manage Admins:</strong> Go to Admin Panel → Manage Admins to add other admin users</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center space-x-4">
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/admin"
                className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 