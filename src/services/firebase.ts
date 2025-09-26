import {initializeApp, getApps, FirebaseApp} from 'firebase/app';
import {getFirestore, Firestore, connectFirestoreEmulator, enableNetwork, disableNetwork} from 'firebase/firestore';
import {getAuth, Auth} from 'firebase/auth';

// Firebase configuration - Updated with your config
const firebaseConfig = {
  apiKey: "AIzaSyAIV6TBBUlOffZ-WTQENatPFEYKdWiJNYU",
  authDomain: "atl-idea-gen.firebaseapp.com",
  projectId: "atl-idea-gen",
  storageBucket: "atl-idea-gen.firebasestorage.app",
  messagingSenderId: "424865615511",
  appId: "1:424865615511:web:228c31c20e05020633a3d2"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

db = getFirestore(app);
auth = getAuth(app);

// Connection management for containerized environments
let isNetworkEnabled = true;

// Helper function to handle network connectivity issues
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    if (!isNetworkEnabled) {
      await enableNetwork(db);
      isNetworkEnabled = true;
    }
    return true;
  } catch (error) {
    console.warn('Firebase network check failed:', error);
    return false;
  }
};

// Retry wrapper for Firebase operations
export const retryFirebaseOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check connection before operation
      await checkFirebaseConnection();
      
      // Execute the operation with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timeout')), 10000);
      });
      
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);
      
      return result as T;
    } catch (error: any) {
      lastError = error;
      console.warn(`Firebase operation attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on certain errors
      if (error.code === 'auth/invalid-api-key' || error.code === 'auth/project-not-found') {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Firebase operation failed after retries');
};

export { db, auth, firebaseConfig };
export default app;