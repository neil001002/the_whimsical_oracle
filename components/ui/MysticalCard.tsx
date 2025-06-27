import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface MysticalCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  variant?: 'default' | 'glass' | 'solid';
}

export function MysticalCard({ 
  children, 
  style, 
  glowColor,
  variant = 'default' 
}: MysticalCardProps) {
  const { colors, shadows, borderRadius } = useTheme();

  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.glassStrong,
        };
      case 'solid':
        return {
          backgroundColor: colors.surface,
        };
      default:
        return {
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.glassStrong,
        };
    }
  };

  const shadowStyle = glowColor ? {
    ...shadows.glow,
    shadowColor: glowColor,
  } : shadows.medium;

  return (
    <View
      style={[
        styles.container,
        getCardStyle(),
        shadowStyle,
        { borderRadius: borderRadius.lg },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.glassStrong, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: borderRadius.lg }]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
});