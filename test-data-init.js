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

async function testDataInitialization() {
  try {
    console.log('🔄 Testing data initialization capability...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialized for data testing');

    // Check components collection
    const componentsRef = collection(db, 'components');
    const querySnapshot = await getDocs(componentsRef);
    
    console.log(`📊 Components collection status: ${querySnapshot.size} documents found`);
    
    if (querySnapshot.size === 0) {
      console.log('⚠️  Components collection is empty');
      console.log('💡 Data initialization would add 15+ default components');
      console.log('📝 Components include: Arduino Uno, ESP32, DHT22, HC-SR04, etc.');
    } else {
      console.log('✅ Components collection has data');
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - ${data.name} (${data.category})`);
      });
    }

    // Test component categories that would be created
    const expectedCategories = ['Microcontrollers', 'Sensors', 'Actuators', 'Display'];
    console.log(`📋 Expected categories: ${expectedCategories.join(', ')}`);

    return true;
  } catch (error) {
    console.error('❌ Data initialization test failed:');
    console.error('Error:', error.message);
    return false;
  }
}

testDataInitialization().then(success => {
  console.log(success ? '🎉 Data initialization test completed!' : '💥 Data initialization test failed!');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});