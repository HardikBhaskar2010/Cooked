module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          xcodeprojPath: 'ios/AtalIdeaGeneratorRN.xcodeproj',
          plist: [],
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/android/',
          packageImportPath: 'import io.github.react_native_vector_icons.VectorIconsPackage;',
        },
      },
    },
  },
};