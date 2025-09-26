import {initializeApp, getApps, FirebaseApp} from 'firebase/app';
import {getFirestore, Firestore} from 'firebase/firestore';
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

export { db, auth, firebaseConfig };
export default app;