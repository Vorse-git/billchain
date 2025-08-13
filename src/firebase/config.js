// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize the Firebase app instance.
// This should be done only once in the entire application.
const app = initializeApp(firebaseConfig);

// =============================================================================
// AUTHENTICATION SERVICES
// =============================================================================

// Export the Firebase Auth instance to handle user authentication globally.
export const auth = getAuth(app);

// WARNING: Attach the auth instance to the window for debugging.
// Remove or disable in production if not needed.
window.auth = auth;

// Export the Google Auth Provider for OAuth login with Google accounts.
export const googleProvider = new GoogleAuthProvider();
