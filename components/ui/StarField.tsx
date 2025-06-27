import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function StarField() {
  const { colors } = useTheme();

  // Generate random stars
  const stars: Star[] = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3000,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map((star) => (
        <StarComponent key={star.id} star={star} colors={colors} />
      ))}
    </View>
  );
}

interface StarComponentProps {
  star: Star;
  colors: any;
}

function StarComponent({ star, colors }: StarComponentProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          backgroundColor: colors.text,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    borderRadius: 50,
  },
});