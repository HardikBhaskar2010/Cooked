const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAIV6TBBUlOffZ-WTQENatPFEYKdWiJNYU",
  authDomain: "atl-idea-gen.firebaseapp.com",
  projectId: "atl-idea-gen",
  storageBucket: "atl-idea-gen.firebasestorage.app",
  messagingSenderId: "424865615511",
  appId: "1:424865615511:web:228c31c20e05020633a3d2"
};

async function testFirebaseConnection() {
  try {
    console.log('🔄 Testing Firebase connectivity...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');

    // Test Firestore read
    console.log('🔄 Testing Firestore connection...');
    const componentsRef = collection(db, 'components');
    
    // Set a timeout for the operation
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout (10s)')), 10000)
    );
    
    const querySnapshot = await Promise.race([
      getDocs(componentsRef),
      timeout
    ]);
    
    console.log(`✅ Firestore connection successful! Found ${querySnapshot.size} documents in components collection`);
    
    if (querySnapshot.size === 0) {
      console.log('⚠️  Warning: Components collection is empty - this may need initialization');
    }

    return true;
  } catch (error) {
    console.error('❌ Firebase connectivity test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.message.includes('timeout')) {
      console.error('🔍 This appears to be a network connectivity issue');
    } else if (error.code === 'permission-denied') {
      console.error('🔍 This appears to be a Firestore security rules issue');
    } else if (error.code === 'invalid-api-key') {
      console.error('🔍 This appears to be an invalid API key');
    }
    
    return false;
  }
}

testFirebaseConnection().then(success => {
  console.log(success ? '🎉 Firebase test completed successfully!' : '💥 Firebase test failed!');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});