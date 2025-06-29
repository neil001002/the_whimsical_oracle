import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Video, VideoOff, Loader } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface VideoOracleButtonProps {
  onPress: () => void;
  isConnected: boolean;
  isLoading: boolean;
  disabled?: boolean;
  style?: any;
}

export function VideoOracleButton({
  onPress,
  isConnected,
  isLoading,
  disabled = false,
  style,
}: VideoOracleButtonProps) {
  const { colors, fonts } = useTheme();

  const getButtonColor = () => {
    if (disabled) return colors.textSecondary;
    if (isConnected) return colors.error;
    return colors.accent;
  };

  const getButtonText = () => {
    if (isLoading) return 'Connecting...';
    if (isConnected) return 'End Video Chat';
    return 'Start Video Chat';
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader color={getButtonColor()} size={24} />;
    }
    return isConnected ? 
      <VideoOff color={getButtonColor()} size={24} /> : 
      <Video color={getButtonColor()} size={24} />;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: getButtonColor(),
          backgroundColor: isConnected ? 
            'rgba(239, 68, 68, 0.1)' : 
            'rgba(255, 255, 255, 0.1)',
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={[
          styles.text,
          { color: getButtonColor(), fontFamily: fonts.body }
        ]}>
          {getButtonText()}
        </Text>
      </View>
      {isConnected && (
        <View style={styles.connectedIndicator}>
          <View style={[styles.connectedDot, { backgroundColor: colors.success }]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 25,
    minWidth: 160,
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  connectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  connectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.6,
  },
});