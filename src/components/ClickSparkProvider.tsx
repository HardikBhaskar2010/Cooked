import React, { createContext, useContext, useState, useRef } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';

interface Spark {
  id: string;
  x: number;
  y: number;
  animatedValue: Animated.Value;
}

interface ClickSparkContextType {
  addSpark: (x: number, y: number) => void;
}

const ClickSparkContext = createContext<ClickSparkContextType | null>(null);

export const useClickSpark = () => {
  const context = useContext(ClickSparkContext);
  if (!context) {
    throw new Error('useClickSpark must be used within ClickSparkProvider');
  }
  return context;
};

interface ClickSparkProviderProps {
  children: React.ReactNode;
}

const ClickSparkProvider: React.FC<ClickSparkProviderProps> = ({ children }) => {
  const theme = useTheme();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkIdRef = useRef(0);

  const addSpark = (x: number, y: number) => {
    const sparkId = `spark-${sparkIdRef.current++}`;
    const animatedValue = new Animated.Value(0);

    const newSpark: Spark = {
      id: sparkId,
      x,
      y,
      animatedValue,
    };

    setSparks(prev => [...prev, newSpark]);

    // Animate the spark
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Remove spark after animation
      setSparks(prev => prev.filter(spark => spark.id !== sparkId));
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      addSpark(locationX, locationY);
    },
  });

  return (
    <ClickSparkContext.Provider value={{ addSpark }}>
      <View style={styles.container} {...panResponder.panHandlers}>
        {children}
        
        {/* Spark particles overlay */}
        <View style={styles.sparkContainer} pointerEvents="none">
          {sparks.map((spark) => (
            <SparkParticle
              key={spark.id}
              x={spark.x}
              y={spark.y}
              animatedValue={spark.animatedValue}
              color={theme.colors.primary}
            />
          ))}
        </View>
      </View>
    </ClickSparkContext.Provider>
  );
};

interface SparkParticleProps {
  x: number;
  y: number;
  animatedValue: Animated.Value;
  color: string;
}

const SparkParticle: React.FC<SparkParticleProps> = ({
  x,
  y,
  animatedValue,
  color,
}) => {
  const sparkElements = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) * (Math.PI / 180);
    const distance = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 25],
    });

    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.cos(angle) * 25],
    });

    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.sin(angle) * 25],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1.2, 0],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.3, 1],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View
        key={i}
        style={[
          styles.sparkElement,
          {
            left: x - 2,
            top: y - 2,
            backgroundColor: color,
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
            opacity,
          },
        ]}
      />
    );
  });

  return <>{sparkElements}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sparkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sparkElement: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default ClickSparkProvider;