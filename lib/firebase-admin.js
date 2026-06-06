import * as admin from "firebase-admin";

if (!admin.apps.length) {
  // Try to initialize using standard environment variables first
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines in private key
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    // Fallback: If running in an environment where ADC is available (like Google Cloud)
    // Or if credentials are not provided, let it attempt default init (will fail if no config is found)
    console.warn("FIREBASE_PRIVATE_KEY not found. Falling back to applicationDefault credentials.");
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const adminDb = admin.firestore();
const adminMessaging = admin.messaging();

export { adminDb, adminMessaging };
