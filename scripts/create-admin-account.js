const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "butterflyauthentique33.firebaseapp.com",
  projectId: "butterflyauthentique33",
  storageBucket: "butterflyauthentique33.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminAccount() {
  const adminEmail = 'butterfly.auth@gmail.com';
  const adminPassword = 'admin123456'; // Change this to a secure password
  const adminName = 'Butterfly Authentique Admin';

  try {
    console.log('Creating admin account...');
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('✅ Admin account created in Firebase Auth');
    console.log('User ID:', user.uid);
    
    // Send email verification
    await sendEmailVerification(user);
    console.log('✅ Email verification sent');
    
    // Create user document in Firestore
    const userDoc = {
      id: user.uid,
      email: adminEmail,
      name: adminName,
      role: 'admin',
      isActive: true,
      emailVerified: false, // Will be true after email verification
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      provider: 'email',
      providerId: 'email'
    };
    
    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ User document created in Firestore');
    
    // Create admin document in admins collection
    const adminDoc = {
      email: adminEmail,
      name: adminName,
      isActive: true,
      isDefault: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'admins', adminEmail), adminDoc);
    console.log('✅ Admin document created in admins collection');
    
    console.log('\n🎉 Admin account setup complete!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\n⚠️  Important:');
    console.log('1. Check your email and verify the account');
    console.log('2. Change the password to something secure');
    console.log('3. You can now log in to the admin panel');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('\nℹ️  Admin account already exists. You can:');
      console.log('1. Try logging in with the existing password');
      console.log('2. Use "Forgot Password" to reset the password');
      console.log('3. Or delete the account and recreate it');
    }
  }
}

// Run the script
createAdminAccount(); 