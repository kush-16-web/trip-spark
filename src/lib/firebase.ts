import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const getFriendlyAuthErrorMessage = (errorCode: string): string | null => {
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized. Please check your Firebase Console settings.';
    case 'auth/popup-closed-by-user':
      return null; // Don't show an error for this
    case 'auth/cancelled-popup-request':
      return null;
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please enable it in Firebase Console.';
    default:
      return 'Failed to sign in. Please try again.';
  }
};