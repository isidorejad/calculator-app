import { useSettings } from '@/contexts/SettingsContext';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// EXPORT this type so other components can use it for type safety.
export type ButtonType = 'number' | 'operator' | 'action' | 'scientific';

interface Props {
  value: string;
  type?: ButtonType;
  // Make sure the `onPress` function expects a ButtonType, not a generic string.
  onPress: (value: string, type: ButtonType) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function CalculatorButton({
  value,
  type = 'number',
  onPress,
  style,
  textStyle,
}: Props) {
  const { playSound, triggerHaptics } = useSettings();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    playSound();
    triggerHaptics();
    // Pass the correctly-typed 'type' back to the parent.
    onPress(value, type);
  };

  const onPressIn = () => {
    scale.value = withSpring(0.9);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.button, typeStyles[type], style, animatedStyle]}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Text style={[styles.buttonText, textStyle, type === 'scientific' && styles.scientificText]}>{value}</Text>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  buttonText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  scientificText: {
      fontSize: 24, // Smaller font for scientific function names
  }
});

const typeStyles = StyleSheet.create({
  number: {
    backgroundColor: '#333333',
  },
  operator: {
    backgroundColor: '#FF9500', // Orange for operators
  },
  action: {
    backgroundColor: '#A5A5A5', // Light grey for actions
  },
  scientific: {
    backgroundColor: '#4A90E2', // Blue for scientific functions
  },
});