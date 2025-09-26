import React from 'react';
import { TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useClickSpark } from './ClickSparkProvider';

interface TouchableSparkWrapperProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: any;
  disabled?: boolean;
  activeOpacity?: number;
}

const TouchableSparkWrapper: React.FC<TouchableSparkWrapperProps> = ({
  children,
  onPress,
  style,
  disabled = false,
  activeOpacity = 0.7,
  ...props
}) => {
  const { addSpark } = useClickSpark();

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled) {
      const { locationX, locationY } = event.nativeEvent;
      addSpark(locationX, locationY);
      onPress?.(event);
    }
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

export default TouchableSparkWrapper;