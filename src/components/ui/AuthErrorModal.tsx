'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  Mail, 
  Lock, 
  UserPlus, 
  RefreshCw, 
  X,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export interface AuthError {
  code: string;
  message: string;
  title: string;
  icon: 'error' | 'warning' | 'info';
  actions: AuthErrorAction[];
}

export interface AuthErrorAction {
  label: string;
  action: 'navigate' | 'retry' | 'resend' | 'close';
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'outline';
}

interface AuthErrorModalProps {
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => void;
  onResend?: () => void;
}

export default function AuthErrorModal({ error, onClose, onRetry, onResend }: AuthErrorModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!error) return null;

  const handleAction = async (action: AuthErrorAction) => {
    setIsLoading(true);
    
    try {
      switch (action.action) {
        case 'navigate':
          if (action.href) {
            router.push(action.href);
          }
          break;
        case 'retry':
          if (onRetry) {
            await onRetry();
          }
          break;
        case 'resend':
          if (onResend) {
            await onResend();
          }
          break;
        case 'close':
          onClose();
          break;
      }
    } catch (error) {
      console.error('Action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (error.icon) {
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
      case 'info':
        return <Info className="h-8 w-8 text-blue-600" />;
      default:
        return <AlertCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getIconBg = () => {
    switch (error.icon) {
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-red-100';
    }
  };

  const getButtonVariant = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-200';
      case 'outline':
        return 'bg-transparent text-rose-600 border-2 border-rose-600 hover:bg-rose-50 focus:ring-rose-200';
      default:
        return 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {error.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${getIconBg()} mb-4`}>
              {getIcon()}
            </div>
            <p className="text-gray-600 leading-relaxed">
              {error.message}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {error.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action)}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:ring-4 focus:outline-none ${getButtonVariant(action.variant)}`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    {action.label}
                    {action.action === 'navigate' && <ArrowRight className="h-5 w-5" />}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Predefined error configurations
export const AUTH_ERRORS = {
  // Sign In Errors
  USER_NOT_FOUND: {
    code: 'auth/user-not-found',
    title: 'Account Not Found',
    message: 'No account exists with this email address. Would you like to create a new account?',
    icon: 'info' as const,
    actions: [
      {
        label: 'Create Account',
        action: 'navigate' as const,
        href: '/register',
        variant: 'primary' as const
      },
      {
        label: 'Try Different Email',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  WRONG_PASSWORD: {
    code: 'auth/wrong-password',
    title: 'Incorrect Password',
    message: 'The password you entered is incorrect. Would you like to reset your password?',
    icon: 'warning' as const,
    actions: [
      {
        label: 'Reset Password',
        action: 'navigate' as const,
        href: '/forgot-password',
        variant: 'primary' as const
      },
      {
        label: 'Try Again',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  EMAIL_NOT_VERIFIED: {
    code: 'auth/email-not-verified',
    title: 'Email Not Verified',
    message: 'Please verify your email address before signing in. Check your inbox and spam folder for the verification link.',
    icon: 'warning' as const,
    actions: [
      {
        label: 'Resend Verification Email',
        action: 'resend' as const,
        variant: 'primary' as const
      },
      {
        label: 'Go to Sign In',
        action: 'navigate' as const,
        href: '/login',
        variant: 'secondary' as const
      }
    ]
  },
  
  USER_DISABLED: {
    code: 'auth/user-disabled',
    title: 'Account Disabled',
    message: 'This account has been disabled. Please contact our support team for assistance.',
    icon: 'error' as const,
    actions: [
      {
        label: 'Contact Support',
        action: 'navigate' as const,
        href: '/contact',
        variant: 'primary' as const
      },
      {
        label: 'Close',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  TOO_MANY_REQUESTS: {
    code: 'auth/too-many-requests',
    title: 'Too Many Attempts',
    message: 'Too many failed sign-in attempts. Please wait a few minutes before trying again.',
    icon: 'warning' as const,
    actions: [
      {
        label: 'Try Again Later',
        action: 'close' as const,
        variant: 'primary' as const
      },
      {
        label: 'Reset Password',
        action: 'navigate' as const,
        href: '/forgot-password',
        variant: 'outline' as const
      }
    ]
  },
  
  INVALID_EMAIL: {
    code: 'auth/invalid-email',
    title: 'Invalid Email',
    message: 'Please enter a valid email address in the correct format.',
    icon: 'warning' as const,
    actions: [
      {
        label: 'Try Again',
        action: 'close' as const,
        variant: 'primary' as const
      }
    ]
  },
  
  // Sign Up Errors
  EMAIL_ALREADY_IN_USE: {
    code: 'auth/email-already-in-use',
    title: 'Email Already Registered',
    message: 'An account with this email already exists. Would you like to sign in instead?',
    icon: 'info' as const,
    actions: [
      {
        label: 'Sign In',
        action: 'navigate' as const,
        href: '/login',
        variant: 'primary' as const
      },
      {
        label: 'Try Different Email',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  WEAK_PASSWORD: {
    code: 'auth/weak-password',
    title: 'Password Too Weak',
    message: 'Your password should be at least 6 characters long. Please choose a stronger password.',
    icon: 'warning' as const,
    actions: [
      {
        label: 'Try Again',
        action: 'close' as const,
        variant: 'primary' as const
      }
    ]
  },
  
  OPERATION_NOT_ALLOWED: {
    code: 'auth/operation-not-allowed',
    title: 'Registration Disabled',
    message: 'Email/password registration is currently disabled. Please contact support for assistance.',
    icon: 'error' as const,
    actions: [
      {
        label: 'Contact Support',
        action: 'navigate' as const,
        href: '/contact',
        variant: 'primary' as const
      },
      {
        label: 'Close',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  // Password Reset Errors
  PASSWORD_RESET_USER_NOT_FOUND: {
    code: 'auth/user-not-found',
    title: 'Account Not Found',
    message: 'No account exists with this email address. Would you like to create a new account?',
    icon: 'info' as const,
    actions: [
      {
        label: 'Create Account',
        action: 'navigate' as const,
        href: '/register',
        variant: 'primary' as const
      },
      {
        label: 'Try Different Email',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  // Network Errors
  NETWORK_ERROR: {
    code: 'auth/network-request-failed',
    title: 'Connection Error',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    icon: 'error' as const,
    actions: [
      {
        label: 'Retry',
        action: 'retry' as const,
        variant: 'primary' as const
      },
      {
        label: 'Close',
        action: 'close' as const,
        variant: 'secondary' as const
      }
    ]
  },
  
  // Generic Error
  GENERIC_ERROR: {
    code: 'auth/generic-error',
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    icon: 'error' as const,
    actions: [
      {
        label: 'Try Again',
        action: 'retry' as const,
        variant: 'primary' as const
      },
      {
        label: 'Contact Support',
        action: 'navigate' as const,
        href: '/contact',
        variant: 'outline' as const
      }
    ]
  }
};

// Helper function to get error configuration
export function getAuthError(errorCode: string): AuthError {
  const errorMap: Record<string, AuthError> = {
    'auth/user-not-found': AUTH_ERRORS.USER_NOT_FOUND,
    'auth/wrong-password': AUTH_ERRORS.WRONG_PASSWORD,
    'auth/email-not-verified': AUTH_ERRORS.EMAIL_NOT_VERIFIED,
    'auth/user-disabled': AUTH_ERRORS.USER_DISABLED,
    'auth/too-many-requests': AUTH_ERRORS.TOO_MANY_REQUESTS,
    'auth/invalid-email': AUTH_ERRORS.INVALID_EMAIL,
    'auth/email-already-in-use': AUTH_ERRORS.EMAIL_ALREADY_IN_USE,
    'auth/weak-password': AUTH_ERRORS.WEAK_PASSWORD,
    'auth/operation-not-allowed': AUTH_ERRORS.OPERATION_NOT_ALLOWED,
    'auth/network-request-failed': AUTH_ERRORS.NETWORK_ERROR,
  };
  
  return errorMap[errorCode] || AUTH_ERRORS.GENERIC_ERROR;
} 