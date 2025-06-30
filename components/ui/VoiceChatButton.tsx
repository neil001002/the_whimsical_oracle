import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';

interface VoiceChatButtonProps {
  style?: any;
}

export function VoiceChatButton({ style }: VoiceChatButtonProps) {
  const { colors, fonts } = useTheme();
  const {
    isPlayingVoice,
    stopVoice,
    userPreferences,
    isVoiceServiceAvailable,
  } = useOracle();

  if (!userPreferences.voiceEnabled || !isVoiceServiceAvailable) {
    return null;
  }

  const handlePress = async () => {
    if (isPlayingVoice) {
      await stopVoice();
    }
  };

  const getButtonColor = () => {
    if (isPlayingVoice) return colors.error;
    return colors.accent;
  };

  const getButtonText = () => {
    if (isPlayingVoice) return 'Stop Voice';
    return 'Voice Ready';
  };

  const getIcon = () => {
    if (isPlayingVoice) {
      return <MicOff color={getButtonColor()} size={24} />;
    }
    return <Volume2 color={getButtonColor()} size={24} />;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: getButtonColor(),
          backgroundColor: isPlayingVoice ? 
            'rgba(239, 68, 68, 0.1)' : 
            'rgba(255, 255, 255, 0.1)',
        },
        style,
      ]}
      onPress={handlePress}
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
      {isPlayingVoice && (
        <View style={styles.playingIndicator}>
          <View style={[styles.playingDot, { backgroundColor: colors.error }]} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 25,
    minWidth: 120,
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
  playingIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  playingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});