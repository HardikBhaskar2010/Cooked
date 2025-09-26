// Simple Firebase connection test
const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAIV6TBBUlOffZ-WTQENatPFEYKdWiJNYU",
  authDomain: "atl-idea-gen.firebaseapp.com",
  projectId: "atl-idea-gen",
  storageBucket: "atl-idea-gen.firebasestorage.app",
  messagingSenderId: "424865615511",
  appId: "1:424865615511:web:228c31c20e05020633a3d2"
};

async function testFirebase() {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('📊 Project ID:', firebaseConfig.projectId);
    
    // Try to read from components collection
    const componentsRef = collection(db, 'components');
    const snapshot = await getDocs(componentsRef);
    
    console.log(`✅ Successfully connected to Firestore`);
    console.log(`📦 Components collection has ${snapshot.size} documents`);
    
    if (!snapshot.empty) {
      console.log('📄 Sample component:', snapshot.docs[0].data().name);
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
  }
}

testFirebase();