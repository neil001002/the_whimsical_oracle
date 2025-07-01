import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface BoltBadgeProps {
  style?: any;
  variant?: 'default' | 'minimal' | 'cosmic';
  size?: 'small' | 'medium' | 'large';
}

export function BoltBadge({ 
  style, 
  variant = 'cosmic', 
  size = 'medium' 
}: BoltBadgeProps) {
  const { colors, fonts } = useTheme();

  const handlePress = () => {
    Linking.openURL('https://bolt.new');
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 10,
          iconSize: 12,
        };
      case 'large':
        return {
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 14,
          iconSize: 18,
        };
      default:
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 12,
          iconSize: 14,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: colors.textSecondary,
        };
      case 'default':
        return {
          backgroundColor: '#000000',
          borderColor: '#333333',
          textColor: '#FFFFFF',
        };
      case 'cosmic':
      default:
        return {
          backgroundColor: colors.glassGolden,
          borderColor: colors.borderGolden,
          textColor: colors.accent,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Zap 
          color={variantStyles.textColor} 
          size={sizeStyles.iconSize} 
          fill={variantStyles.textColor}
        />
        <Text 
          style={[
            styles.text, 
            { 
              color: variantStyles.textColor, 
              fontSize: sizeStyles.fontSize,
              fontFamily: fonts.body,
            }
          ]}
        >
          Built on Bolt
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});