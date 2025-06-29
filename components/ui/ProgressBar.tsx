import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useEffect,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  duration?: number;
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  duration = 1000,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const progressValue = useSharedValue(0);

  const progressColor = color || colors.accent;
  const bgColor = backgroundColor || colors.surface;

  useEffect(() => {
    if (animated) {
      progressValue.value = withTiming(progress, { duration });
    } else {
      progressValue.value = progress;
    }
  }, [progress, animated, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  return (
    <View style={[styles.container, { height, backgroundColor: bgColor }]}>
      <Animated.View
        style={[
          styles.progress,
          { backgroundColor: progressColor, height },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});