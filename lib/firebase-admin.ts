import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Firebase Admin SDK configuration
// Used for server-side operations (verifying tokens, creating users in Firestore, etc.)
// These credentials should NEVER be exposed to the client

function getAdminApp(): App {
  // Check if already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Initialize with service account credentials
  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key comes from the service account JSON
      // It contains newlines that need to be properly handled
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

  return app;
}

// Get admin app instance
const adminApp = getAdminApp();

// Export admin services
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

export default adminApp;
