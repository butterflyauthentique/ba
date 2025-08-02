'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

function VerifyEmailContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  
  const { firebaseUser, sendVerificationEmail, confirmEmailVerification, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already verified
  useEffect(() => {
    if (firebaseUser?.emailVerified) {
      setIsVerified(true);
    }
  }, [firebaseUser]);

  // Handle email verification from URL parameters
  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    if (mode === 'verifyEmail' && oobCode) {
      handleEmailVerification(oobCode);
    }
  }, [searchParams]);

  const handleEmailVerification = async (oobCode: string) => {
    setIsLoading(true);
    try {
      await confirmEmailVerification(oobCode);
      setIsVerified(true);
      // Refresh user data to update emailVerified status
      await refreshUser();
    } catch (error) {
      console.error('Email verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!firebaseUser) {
      toast.error('Please sign in first');
      return;
    }

    setIsLoading(true);
    
    try {
      await sendVerificationEmail();
      setVerificationAttempts(prev => prev + 1);
      toast.success('Verification email sent! Check your inbox');
    } catch (error) {
      console.error('Send verification email error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/');
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img 
                src="/logo.png" 
                alt="Butterfly Authentique" 
                className="h-12 w-auto mx-auto"
              />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600">
              Your account is now active
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome to Butterfly Authentique!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now access all features of your account.
              </p>
              
              <button
                onClick={handleContinue}
                className="w-full bg-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-rose-700 focus:ring-4 focus:ring-rose-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Continue to Home
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img 
              src="/logo.png" 
              alt="Butterfly Authentique" 
              className="h-12 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification link to your email
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent a verification email to <strong>{firebaseUser?.email}</strong>. 
              Please click the verification link in the email to activate your account.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isLoading || verificationAttempts >= 3}
                className="w-full bg-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-rose-700 focus:ring-4 focus:ring-rose-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Resend Verification Email
                    <RefreshCw className="h-5 w-5" />
                  </>
                )}
              </button>
              
              {verificationAttempts >= 3 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Maximum resend attempts reached. Please check your spam folder or contact support.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Link
                href="/login"
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Didn't receive the email? Check your spam folder or try resending the verification email.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Troubleshooting:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• Wait a few minutes before requesting another email</li>
            <li>• Contact support if you continue to have issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
} 