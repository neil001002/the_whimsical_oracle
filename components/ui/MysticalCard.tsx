import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useEffect,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface MysticalCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  variant?: 'default' | 'glass' | 'solid' | 'ethereal' | 'golden';
  animated?: boolean;
  borderStyle?: 'simple' | 'ornate' | 'cosmic';
}

export function MysticalCard({ 
  children, 
  style, 
  glowColor,
  variant = 'default',
  animated = false,
  borderStyle = 'simple'
}: MysticalCardProps) {
  const { colors, shadows, borderRadius } = useTheme();
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (animated) {
      glowOpacity.value = withRepeat(
        withTiming(0.8, { duration: 2000 }),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.borderStrong,
        };
      case 'solid':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'ethereal':
        return {
          backgroundColor: colors.glassMystic,
          borderWidth: 1,
          borderColor: colors.borderMystic,
        };
      case 'golden':
        return {
          backgroundColor: colors.glassGolden,
          borderWidth: 1,
          borderColor: colors.borderGolden,
        };
      default:
        return {
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.glassStrong,
        };
    }
  };

  const getBorderDecoration = () => {
    if (borderStyle === 'ornate') {
      return (
        <View style={styles.ornateCorners}>
          <View style={[styles.corner, styles.topLeft, { borderColor: colors.accent }]} />
          <View style={[styles.corner, styles.topRight, { borderColor: colors.accent }]} />
          <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.accent }]} />
          <View style={[styles.corner, styles.bottomRight, { borderColor: colors.accent }]} />
        </View>
      );
    }
    return null;
  };

  const shadowStyle = glowColor ? {
    ...shadows.glow,
    shadowColor: glowColor,
  } : variant === 'ethereal' ? shadows.mystical : shadows.medium;

  return (
    <View style={[styles.container, style]}>
      {/* Animated glow effect */}
      {animated && (
        <Animated.View
          style={[
            styles.glowContainer,
            { borderRadius: borderRadius.lg },
            animatedGlowStyle,
          ]}
        >
          <LinearGradient
            colors={[
              glowColor || colors.accent + '40',
              'transparent',
              glowColor || colors.accent + '40',
            ]}
            style={[styles.glow, { borderRadius: borderRadius.lg }]}
          />
        </Animated.View>
      )}
      
      <View
        style={[
          styles.card,
          getCardStyle(),
          shadowStyle,
          { borderRadius: borderRadius.lg },
        ]}
      >
        <LinearGradient
          colors={[
            variant === 'ethereal' ? colors.glassMystic : 
            variant === 'golden' ? colors.glassGolden : colors.glassStrong,
            'transparent'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: borderRadius.lg }]}
        >
          {children}
        </LinearGradient>
        
        {getBorderDecoration()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
  },
  glow: {
    flex: 1,
  },
  card: {
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    padding: 20,
  },
  ornateCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 2,
  },
  topLeft: {
    top: 8,
    left: 8,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 8,
    right: 8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 8,
    left: 8,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 8,
    right: 8,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});