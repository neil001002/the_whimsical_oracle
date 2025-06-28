import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Mic, MicOff, MessageCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';

interface VoiceChatButtonProps {
  style?: any;
}

export function VoiceChatButton({ style }: VoiceChatButtonProps) {
  const { colors, fonts } = useTheme();
  const {
    isVoiceChatConnected,
    isVoiceRecording,
    startVoiceRecording,
    stopVoiceRecording,
    connectToVoiceChat,
    disconnectFromVoiceChat,
    userPreferences,
  } = useOracle();

  if (!userPreferences.realTimeChatEnabled) {
    return null;
  }

  const handlePress = async () => {
    if (!isVoiceChatConnected) {
      await connectToVoiceChat();
    } else if (isVoiceRecording) {
      await stopVoiceRecording();
    } else {
      await startVoiceRecording();
    }
  };

  const getButtonColor = () => {
    if (!isVoiceChatConnected) return colors.textSecondary;
    if (isVoiceRecording) return colors.error;
    return colors.accent;
  };

  const getButtonText = () => {
    if (!isVoiceChatConnected) return 'Connect';
    if (isVoiceRecording) return 'Recording...';
    return 'Tap to Speak';
  };

  const getIcon = () => {
    if (!isVoiceChatConnected) {
      return <MessageCircle color={getButtonColor()} size={24} />;
    }
    return isVoiceRecording ? 
      <MicOff color={getButtonColor()} size={24} /> : 
      <Mic color={getButtonColor()} size={24} />;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: getButtonColor(),
          backgroundColor: isVoiceRecording ? 
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
      {isVoiceRecording && (
        <View style={styles.recordingIndicator}>
          <View style={[styles.recordingDot, { backgroundColor: colors.error }]} />
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
  recordingIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});