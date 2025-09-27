# Atal Idea Generator – React Native App

## 🚀 Mobile-First STEM Project Generator Powered by Firebase

### 📱 Project Overview

The Atal Idea Generator is a React Native mobile application backed by Firebase, offering STEM project ideas based on available electronic components. By removing the need for a separate backend server, deployment is simple, scalable, and cross-platform.

### ✨ Key Features

- 🤖 AI Project Generator – Personalized electronics project suggestions
- 🔧 Component Database – 500+ components with specs and categories
- 📚 Project Library – Save, organize, and track project progress
- 👤 User Authentication – Firebase Auth for secure sign-in/sign-up
- 📱 Mobile-First Design – Optimized for both iOS and Android
- 🔄 Real-time Sync – Instant data updates across devices

### 🏗️ Architecture

**Current Stack**:
- Frontend: React Native 0.72.7 with Expo support
- Backend: Firebase (Firestore + Authentication)
- UI Framework: React Native Paper (Material Design)
- Navigation: React Navigation 6
- State Management: TanStack Query + Context API
- Icons: React Native Vector Icons

**Firebase Configuration**:
- Project ID: atl-idea-gen
- Firestore Collections: components, projects, users
- Authentication: Firebase Auth enabled

### 🚀 Quick Start

**Prerequisites**:
- Node.js 16+
- React Native dev environment
- Android Studio (for Android) or Xcode (for iOS)
- Web browser for web testing

**Installation & Setup**:

Install Dependencies:
```
npm install --legacy-peer-deps
```

**Web Testing**:
```
npm run dev
```
Web app runs at http://localhost:3000

**Mobile Testing**:
```
npm start         # Start Metro Bundler
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
```

### 📦 Project Structure

```
/app/
├── src/
│   ├── screens/           # App screens
│   ├── components/        # Reusable UI components
│   ├── contexts/          # State management
│   ├── services/          # Firebase API layer
│   └── hooks/             # Custom React hooks
├── App.tsx               # Main component
├── index.js              # Entry point
└── package.json          # Dependencies
```

### 🔥 Firebase Collections

**Components**:
```json
{
  "id": "arduino-uno",
  "name": "Arduino Uno R3",
  "description": "Microcontroller board...",
  "category": "Microcontrollers",
  "price_range": "$20-30",
  "specifications": {},
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Projects**:
```json
{
  "id": "project-123",
  "title": "Smart LED Controller",
  "category": "IoT",
  "difficulty": "beginner",
  "status": "saved",
  "instructions": "Step by step...",
  "components": ["Arduino Uno", "LEDs"],
  "user_id": "user-abc",
  "dateSaved": "timestamp"
}
```

**Users**:
```json
{
  "id": "user-abc",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar_url": "https://...",
  "created_at": "timestamp"
}
```

### 📱 App Screens

- Home Dashboard
- Components Browser
- AI Project Generator
- Project Library
- Profile & Settings

### 🎨 UI/UX Highlights

- Bottom Tab Navigation for quick access
- Card-based Layouts for clean organization
- Dark Mode support
- Touch-Friendly design
- Pull-to-Refresh & smooth loading states
- Responsive Design for different screen sizes

### 🧪 Development & Testing

**Web**:
```
npm run dev
```

**React Native Mobile**:
```
npm start
npm run android
npm run ios
```

**Build & Test**:
```
npm run build
npm test
npm run lint
```

Debugging Tools: React Native Debugger, Firebase Console, Chrome DevTools, Flipper

### 🚀 Deployment

**Android**:
```
cd android
./gradlew assembleRelease
./gradlew bundleRelease   # For Play Store
```

**iOS**:
```
npx react-native run-ios --configuration Release
# Xcode for App Store deployment
```

**Firebase**:
- Auth & database rules configured
- Optional: Cloud Functions for advanced features

### 📊 Current Status

✅ Completed:
- Full React Native structure
- Firebase integration
- Component database & AI generator
- User authentication & project library
- Mobile-optimized UI/UX

🔄 Ready for Enhancement:
- Push notifications
- Social sharing
- Advanced AI integration
- AR component scanner
- Community features & ratings
- Export to PDF/Email

### 🎯 Next Steps

- Test on device/emulator
- Add more components & templates
- Implement social login
- Deploy to App Store & Play Store

### 🤝 Contributing

- Add new components & project templates
- Enhance AI generator & UI/UX
- Build new features & screens

### 🏆 Credits

- Lead Developer & Maintainer: Luna Kitsune
- Special Thanks: Hardik Bhaskar (for testing, support, & brainstorming ideas)
- Libraries & Tools Used: React Native, Firebase, React Native Paper, TanStack Query, React Navigation
