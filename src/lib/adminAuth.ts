import { User } from '@/types/database';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';

// Default admin email
export const DEFAULT_ADMIN_EMAIL = 'butterfly.auth@gmail.com';

// Default admin user object
export const ADMIN_USER = {
  id: 'admin-1',
  email: DEFAULT_ADMIN_EMAIL,
  name: 'Butterfly Authentique Admin',
  role: 'admin' as const,
  isActive: true,
  emailVerified: true,
  createdAt: new Date() as any,
  updatedAt: new Date() as any,
  provider: 'email' as const,
  providerId: 'email'
};

// Check if a user is an admin
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // Check if it's the default admin
    if (user.email === DEFAULT_ADMIN_EMAIL) {
      return true;
    }
    
    // Check if user is in admins collection
    const adminDoc = await getDoc(doc(db, 'admins', user.email || ''));
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      return adminData.isActive === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get all admins
export const getAllAdmins = async (): Promise<User[]> => {
  try {
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    const admins = adminsSnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.id,
      name: doc.data().name || doc.id,
      role: 'admin' as const,
      isActive: doc.data().isActive || false,
      emailVerified: true,
      createdAt: doc.data().createdAt || new Date(),
      updatedAt: doc.data().updatedAt || new Date(),
      provider: 'email' as const,
      providerId: 'email'
    }));
    
    // Add default admin at the beginning
    admins.unshift(ADMIN_USER);
    
    return admins;
  } catch (error) {
    console.error('Error getting admins:', error);
    return [ADMIN_USER]; // Return at least the default admin
  }
};

// Add new admin
export const addAdmin = async (email: string, name: string): Promise<boolean> => {
  try {
    const { setDoc, serverTimestamp } = await import('firebase/firestore');
    
    await setDoc(doc(db, 'admins', email), {
      email,
      name,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding admin:', error);
    return false;
  }
};

// Remove admin
export const removeAdmin = async (email: string): Promise<boolean> => {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    
    await deleteDoc(doc(db, 'admins', email));
    
    return true;
  } catch (error) {
    console.error('Error removing admin:', error);
    return false;
  }
};

// Environment detection
export const isDevelopment = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side: check environment variables
    return process.env.NODE_ENV === 'development';
  }
  // Client-side: check hostname
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('localhost');
};

// API endpoint utilities
export const getAdminApiEndpoint = (endpoint: string): string => {
  const isDev = isDevelopment();
  const url = isDev ? `/api/${endpoint}/` : `https://us-central1-butterflyauthentique33.cloudfunctions.net/${endpoint}`;
  console.log(`Admin API endpoint for ${endpoint}: ${url} (${isDev ? 'development' : 'production'})`);
  return url;
};

export const getAddAdminEndpoint = (): string => {
  const isDev = isDevelopment();
  const url = isDev ? `/api/admins/` : `https://us-central1-butterflyauthentique33.cloudfunctions.net/addAdmin`;
  console.log(`Add admin endpoint: ${url} (${isDev ? 'development' : 'production'})`);
  return url;
};

export const getRemoveAdminEndpoint = (): string => {
  const isDev = isDevelopment();
  const url = isDev ? `/api/admins/` : `https://us-central1-butterflyauthentique33.cloudfunctions.net/removeAdmin`;
  console.log(`Remove admin endpoint: ${url} (${isDev ? 'development' : 'production'})`);
  return url;
}; 