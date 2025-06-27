import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export function LoadingSpinner({ size = 40, color }: LoadingSpinnerProps) {
  const { colors } = useTheme();
  const spinnerColor = color || colors.accent;
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      -1,
      true
    );
  }, []);
  
  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });
  
  const dotStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.7 + (scale.value - 0.8) * 0.5,
    };
  });
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.spinnerRing, { borderColor: spinnerColor, width: size, height: size }, spinnerStyle]}>
        <Animated.View style={[styles.dot, { backgroundColor: spinnerColor }, dotStyle]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerRing: {
    borderWidth: 2,
    borderRadius: 100,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: -3,
  },
});