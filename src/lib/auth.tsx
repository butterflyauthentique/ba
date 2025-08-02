'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  UserCredential,
  applyActionCode,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, collections } from './firebase';
import { User } from '@/types/database';
import toast from 'react-hot-toast';
import { AuthError, getAuthError } from '@/components/ui/AuthErrorModal';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authError: AuthError | null;
  setAuthError: (error: AuthError | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  confirmEmailVerification: (oobCode: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  // Convert Firebase User to our User type
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    // Check if user exists in our database
    const userDoc = await getDoc(doc(collections.users, firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      // Update emailVerified status if it changed
      if (userData.emailVerified !== firebaseUser.emailVerified) {
        await setDoc(doc(collections.users, firebaseUser.uid), {
          emailVerified: firebaseUser.emailVerified,
          updatedAt: serverTimestamp()
        }, { merge: true });
        return { ...userData, emailVerified: firebaseUser.emailVerified };
      }
      return { ...userData, id: firebaseUser.uid };
    }

    // Create new user in our database
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
      role: 'user',
      isActive: true,
      emailVerified: firebaseUser.emailVerified,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      provider: 'email',
      providerId: firebaseUser.providerData[0]?.providerId || 'email'
    };

    await setDoc(doc(collections.users, firebaseUser.uid), newUser);
    return newUser;
  };

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setAuthError(null); // Clear any previous errors
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        // Sign out the user since they're not verified
        await signOut(auth);
        setAuthError(getAuthError('auth/email-not-verified'));
        return;
      }

      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific error codes with modal
      if (error.code) {
        setAuthError(getAuthError(error.code));
      } else {
        // Handle network or unknown errors
        setAuthError(getAuthError('auth/network-request-failed'));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setAuthError(null); // Clear any previous errors
      
      // Basic email validation
      const emailDomain = email.split('@')[1];
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      if (!commonDomains.includes(emailDomain)) {
        setAuthError(getAuthError('auth/invalid-email'));
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Send verification email with custom settings
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/verify-email?email=${encodeURIComponent(email)}`,
        handleCodeInApp: false
      });
      
      // Success is now handled in the UI component
      // toast.success('Account created! Please check your email to verify your account');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific error codes with modal
      if (error.code) {
        setAuthError(getAuthError(error.code));
      } else {
        // Handle network or unknown errors
        setAuthError(getAuthError('auth/network-request-failed'));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password-confirm`,
        handleCodeInApp: false
      });
      toast.success('Password reset email sent! Check your inbox');
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // Handle specific error codes with modal
      if (error.code) {
        setAuthError(getAuthError(error.code));
      } else {
        setAuthError(getAuthError('auth/network-request-failed'));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Confirm password reset function
  const confirmPasswordResetUser = async (oobCode: string, newPassword: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success('Password reset successfully! You can now sign in with your new password');
    } catch (error: any) {
      console.error('Confirm password reset error:', error);
      
      // Handle specific error codes with modal
      if (error.code) {
        setAuthError(getAuthError(error.code));
      } else {
        setAuthError(getAuthError('auth/network-request-failed'));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send verification email function
  const sendVerificationEmail = async () => {
    if (!firebaseUser) return;
    
    try {
      setLoading(true);
      setAuthError(null);
      
      await sendEmailVerification(firebaseUser, {
        url: `${window.location.origin}/verify-email?email=${encodeURIComponent(firebaseUser.email!)}`,
        handleCodeInApp: false
      });
      toast.success('Verification email sent! Check your inbox and spam folder');
    } catch (error: any) {
      console.error('Send verification email error:', error);
      
      // Handle specific error codes with modal
      if (error.code) {
        setAuthError(getAuthError(error.code));
      } else {
        setAuthError(getAuthError('auth/network-request-failed'));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Confirm email verification function
  const confirmEmailVerification = async (oobCode: string) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      await applyActionCode(auth, oobCode);
      toast.success('Email verified successfully!');
      
      // Refresh the user to update emailVerified status
      if (firebaseUser) {
        await firebaseUser.reload();
      }
    } catch (error: any) {
      console.error('Confirm email verification error:', error);
      
      // Handle specific error codes with modal
      if (error.code) {
        setAuthError(getAuthError(error.code));
      } else {
        setAuthError(getAuthError('auth/network-request-failed'));
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!firebaseUser || !user) return;
    
    try {
      setLoading(true);
      setAuthError(null);
      
      // Update in Firebase Auth
      if (updates.name) {
        await updateProfile(firebaseUser, { displayName: updates.name });
      }
      
      // Update in Firestore
      await setDoc(doc(collections.users, firebaseUser.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      // Update local state
      setUser({ ...user, ...updates });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      setAuthError(getAuthError('auth/network-request-failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!firebaseUser) return;
    
    try {
      await firebaseUser.reload();
      const userData = await convertFirebaseUser(firebaseUser);
      setUser(userData);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    authError,
    setAuthError,
    signIn,
    signUp,
    signOut: signOutUser,
    resetPassword,
    confirmPasswordReset: confirmPasswordResetUser,
    sendVerificationEmail,
    confirmEmailVerification,
    updateUserProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 