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
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
  const shadowOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (glowing && !disabled) {
      glowOpacity.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );
      
      shadowOpacity.value = withRepeat(
        withTiming(0.9, { duration: 1500 }),
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
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePress = () => {
    console.log('MagicalButton pressed:', title);
    
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
          borderRadius: borderRadius.md,
        };
      case 'large':
        return {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          fontSize: fonts.sizes.lg,
          borderRadius: borderRadius.lg,
        };
      default:
        return {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          fontSize: fonts.sizes.md,
          borderRadius: borderRadius.md,
        };
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    shadowOpacity: shadowOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value * 300 - 150 }],
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
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      {/* Enhanced Glow effect with multiple layers */}
      {glowing && !disabled && (
        <>
          {/* Outer glow */}
          <Animated.View style={[styles.outerGlow, glowStyle]} pointerEvents="none">
            <LinearGradient
              colors={[
                colors.accent + '00',
                colors.accent + '20',
                colors.accent + '40',
                colors.accent + '20',
                colors.accent + '00',
              ]}
              style={[styles.glowGradient, { borderRadius: sizeStyles.borderRadius + 8 }]}
            />
          </Animated.View>
          
          {/* Inner glow */}
          <Animated.View style={[styles.innerGlow, glowStyle]} pointerEvents="none">
            <LinearGradient
              colors={[
                colors.accent + '30',
                colors.accent + '60',
                colors.accent + '30',
              ]}
              style={[styles.glowGradient, { borderRadius: sizeStyles.borderRadius + 4 }]}
            />
          </Animated.View>
        </>
      )}
      
      <AnimatedLinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: sizeStyles.borderRadius,
          },
          variant === 'ghost' && {
            borderWidth: 2,
            borderColor: colors.accent,
          },
          !disabled && (
            variant === 'ethereal' ? {
              ...shadows.mystical,
              shadowColor: colors.accentSecondary,
            } :
            variant === 'golden' ? {
              ...shadows.glow,
              shadowColor: colors.accent,
            } : {
              ...shadows.medium,
              shadowColor: colors.primary,
            }
          ),
          // Enhanced web-specific styling
          Platform.OS === 'web' && {
            boxShadow: !disabled ? (
              variant === 'golden' ? 
                `0 0 20px ${colors.accent}40, 0 4px 15px ${colors.primary}60` :
              variant === 'ethereal' ?
                `0 0 15px ${colors.accentSecondary}40, 0 4px 12px ${colors.primary}50` :
                `0 4px 15px ${colors.primary}60`
            ) : 'none',
          },
        ]}
      >
        {/* Enhanced shimmer effect */}
        {animated && !disabled && (
          <Animated.View style={[styles.shimmerContainer, shimmerStyle]} pointerEvents="none">
            <LinearGradient
              colors={[
                'transparent', 
                colors.text + '20', 
                colors.text + '40',
                colors.text + '20', 
                'transparent'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmer}
            />
          </Animated.View>
        )}
        
        {/* Subtle inner highlight */}
        {!disabled && (
          <LinearGradient
            colors={[
              colors.text + '10',
              'transparent',
              'transparent',
            ]}
            style={[styles.innerHighlight, { borderRadius: sizeStyles.borderRadius }]}
            pointerEvents="none"
          />
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
      </AnimatedLinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    position: 'relative',
    zIndex: 1000,
    // Enhanced web cursor
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  outerGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    pointerEvents: 'none',
  },
  innerGlow: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    pointerEvents: 'none',
  },
  glowGradient: {
    flex: 1,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1001,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: -75,
    right: -75,
    bottom: 0,
    pointerEvents: 'none',
  },
  shimmer: {
    flex: 1,
    width: 80,
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    pointerEvents: 'none',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 1002,
    letterSpacing: 0.5,
    // Enhanced text shadow for better visibility
    ...Platform.select({
      web: {
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        userSelect: 'none',
      },
      default: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
    }),
  },
  disabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    }),
  },
});