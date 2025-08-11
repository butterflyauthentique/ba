import 'server-only';
import admin from 'firebase-admin';

// Initialize Admin SDK once for Next.js server runtime
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('[firebase-admin] Missing service account env. Token verification may fail.');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: projectId || '',
      clientEmail: clientEmail || '',
      privateKey: privateKey || '',
    }),
  });
}

export const auth = admin.auth();


