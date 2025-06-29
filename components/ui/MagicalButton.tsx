import React, { useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

interface MagicalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'ethereal' | 'golden';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animated?: boolean;
  glowing?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function MagicalButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  animated = false,
  glowing = false,
}: MagicalButtonProps) {
  const { colors, fonts, spacing, shadows, borderRadius } = useTheme();
  
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (glowing && !disabled) {
      glowOpacity.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );
    }
    
    if (animated && !disabled) {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        false
      );
    }
  }, [glowing, animated, disabled]);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const getGradientColors = () => {
    if (disabled) return [colors.surface, colors.surface];
    
    switch (variant) {
      case 'primary':
        return colors.gradients.cosmic;
      case 'secondary':
        return colors.gradients.mystic;
      case 'ethereal':
        return colors.gradients.ethereal;
      case 'golden':
        return colors.gradients.golden;
      case 'ghost':
        return ['transparent', 'transparent'];
      default:
        return colors.gradients.cosmic;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    if (variant === 'ghost') return colors.accent;
    return colors.text;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: fonts.sizes.sm,
        };
      case 'large':
        return {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          fontSize: fonts.sizes.lg,
        };
      default:
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          fontSize: fonts.sizes.md,
        };
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value * 200 - 100 }],
  }));

  const sizeStyles = getSizeStyles();

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.container,
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {/* Glow effect */}
      {glowing && !disabled && (
        <Animated.View style={[styles.glowContainer, glowStyle]}>
          <LinearGradient
            colors={[
              colors.accent + '00',
              colors.accent + '40',
              colors.accent + '00',
            ]}
            style={[styles.glow, { borderRadius: borderRadius.md }]}
          />
        </Animated.View>
      )}
      
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          {
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: borderRadius.md,
          },
          variant === 'ghost' && {
            borderWidth: 2,
            borderColor: colors.accent,
          },
          !disabled && (
            variant === 'ethereal' ? shadows.mystical :
            variant === 'golden' ? shadows.glow : shadows.medium
          ),
        ]}
      >
        {/* Shimmer effect */}
        {animated && !disabled && (
          <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
            <LinearGradient
              colors={['transparent', colors.text + '30', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmer}
            />
          </Animated.View>
        )}
        
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: sizeStyles.fontSize,
              fontFamily: fonts.body,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
  },
  glow: {
    flex: 1,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: -50,
    right: -50,
    bottom: 0,
  },
  shimmer: {
    flex: 1,
    width: 50,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 1,
  },
  disabled: {
    opacity: 0.6,
  },
});