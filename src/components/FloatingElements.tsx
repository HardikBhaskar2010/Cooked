import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';

interface FloatingElementsProps {
  style?: any;
}

interface FloatingElement {
  id: number;
  icon: string;
  size: number;
  x: number;
  y: number;
  animatedValue: Animated.Value;
  rotateValue: Animated.Value;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const techIcons = [
  'memory',
  'bolt',
  'developer-board',
  'computer',
  'battery-charging-full',
  'wifi',
  'bluetooth',
  'radio',
  'sensors',
  'cable',
];

export default function FloatingElements({ style }: FloatingElementsProps) {
  const theme = useTheme();
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const floatingElements: FloatingElement[] = [];
    
    // Create floating tech icons
    for (let i = 0; i < 8; i++) {
      const animatedValue = new Animated.Value(0);
      const rotateValue = new Animated.Value(0);
      
      const element: FloatingElement = {
        id: i,
        icon: techIcons[Math.floor(Math.random() * techIcons.length)],
        size: Math.random() * 12 + 16,
        x: Math.random() * (screenWidth - 50),
        y: Math.random() * (screenHeight - 50),
        animatedValue,
        rotateValue,
      };
      
      floatingElements.push(element);
    }
    
    setElements(floatingElements);
    
    // Start animations for each element
    floatingElements.forEach((element, index) => {
      // Floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(element.animatedValue, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(element.animatedValue, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
      
      // Rotation animation
      Animated.loop(
        Animated.timing(element.rotateValue, {
          toValue: 1,
          duration: 8000 + Math.random() * 4000,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      ).start();
    });
  }, []);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {elements.map((element) => {
        const translateY = element.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -30],
        });
        
        const translateX = element.animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, Math.sin(element.id) * 15, 0],
        });
        
        const rotate = element.rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });
        
        const opacity = element.animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 0.3, 0.1],
        });

        return (
          <Animated.View
            key={element.id}
            style={[
              styles.floatingElement,
              {
                left: element.x,
                top: element.y,
                width: element.size,
                height: element.size,
                transform: [
                  { translateY },
                  { translateX },
                  { rotate },
                ],
                opacity,
              },
            ]}
          >
            <Icon
              name={element.icon}
              size={element.size * 0.7}
              color={theme.colors.primary}
              style={{ opacity: 0.4 }}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingElement: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
}