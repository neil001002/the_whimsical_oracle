import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Volume2, 
  Vibrate, 
  Crown, 
  Palette,
  ChevronRight,
  Mic,
  MessageCircle,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { ORACLE_PERSONAS } from '@/constants/OraclePersonas';

export default function SettingsScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { t } = useLanguage();
  const { 
    selectedPersona, 
    userPreferences, 
    updatePersona, 
    updatePreferences,
    playOmenVoice,
    stopVoice,
    isPlayingVoice,
    voiceError,
    isVoiceServiceAvailable,
    isLiveKitAvailable,
    // LiveKit methods
    connectToVoiceChat,
    disconnectFromVoiceChat,
    isVoiceChatConnected,
    voiceChatError
  } = useOracle();

  const testVoice = async () => {
    if (isPlayingVoice) {
      await stopVoice();
    } else {
      const testText = t('settings.voice.testMessage', { 
        persona: selectedPersona.name 
      }) || "Greetings, seeker. This is how your chosen oracle sounds when speaking mystical wisdom.";
      await playOmenVoice(testText, selectedPersona.voiceStyle);
    }
  };

  const toggleVoiceChat = async () => {
    if (isVoiceChatConnected) {
      await disconnectFromVoiceChat();
    } else {
      await connectToVoiceChat();
    }
  };

  const renderPersonaSelector = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.persona.title')}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
        {t('settings.sections.persona.subtitle')}
      </Text>
      
      <View style={styles.personaGrid}>
        {ORACLE_PERSONAS.map((persona) => (
          <TouchableOpacity
            key={persona.id}
            onPress={() => updatePersona(persona.id)}
            style={[
              styles.personaOption,
              { 
                borderColor: selectedPersona.id === persona.id ? colors.accent : colors.glassStrong,
                backgroundColor: selectedPersona.id === persona.id ? colors.glass : 'transparent',
              }
            ]}
          >
            <Text style={[styles.personaAvatar, { fontSize: 32 }]}>
              {persona.avatar}
            </Text>
            <Text style={[styles.personaName, { color: colors.text, fontFamily: fonts.body }]}>
              {t(`personas.${persona.id}.name`) || persona.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </MysticalCard>
  );

  const renderLanguageSettings = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.language.title')}
      </Text>
      
      <LanguageSelector style={styles.languageSelector} />
    </MysticalCard>
  );

  const renderVoiceSettings = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.voice.title')}
      </Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Mic color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.sections.voice.voiceNarration.title')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.voice.voiceNarration.subtitle')}
            </Text>
          </View>
        </View>
        <Switch
          value={userPreferences.voiceEnabled}
          onValueChange={(value) => updatePreferences({ voiceEnabled: value })}
          trackColor={{ false: colors.surface, true: colors.accent }}
          thumbColor={colors.text}
        />
      </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <MessageCircle color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.sections.voice.realTimeChat.title')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.voice.realTimeChat.subtitle')}
            </Text>
          </View>
        </View>
        <Switch
          value={userPreferences.realTimeChatEnabled}
          onValueChange={(value) => updatePreferences({ realTimeChatEnabled: value })}
          trackColor={{ false: colors.surface, true: colors.accent }}
          thumbColor={colors.text}
        />
      </View>

      {/* Service Status Information */}
      <View style={styles.serviceStatusContainer}>
        <Text style={[styles.serviceStatusTitle, { color: colors.text, fontFamily: fonts.body }]}>
          {t('settings.sections.voice.serviceStatus')}
        </Text>
        
        <View style={styles.serviceStatusItem}>
          <Text style={[styles.serviceStatusLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('settings.sections.voice.liveKitStatus')} 
          </Text>
          <Text style={[
            styles.serviceStatusValue, 
            { 
              color: isLiveKitAvailable ? colors.success : colors.warning, 
              fontFamily: fonts.body 
            }
          ]}>
            {isLiveKitAvailable ? t('settings.sections.voice.available') : t('settings.sections.voice.requiresCustomBuild')}
          </Text>
        </View>
        
        <View style={styles.serviceStatusItem}>
          <Text style={[styles.serviceStatusLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('settings.sections.voice.ttsStatus')} 
          </Text>
          <Text style={[
            styles.serviceStatusValue, 
            { 
              color: isVoiceServiceAvailable ? colors.success : colors.error, 
              fontFamily: fonts.body 
            }
          ]}>
            {isVoiceServiceAvailable ? t('settings.sections.voice.available') : t('settings.sections.voice.limited')}
          </Text>
        </View>
      </View>

      {userPreferences.voiceEnabled && (
        <View style={styles.voiceTestContainer}>
          <MagicalButton
            title={isPlayingVoice ? t('settings.sections.voice.stopVoice') : t('settings.sections.voice.testVoice')}
            onPress={testVoice}
            variant="secondary"
            size="small"
          />
          <Text style={[styles.voiceTestNote, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('settings.sections.voice.testNote')}
          </Text>
        </View>
      )}

      {userPreferences.realTimeChatEnabled && isLiveKitAvailable && (
        <View style={styles.voiceChatContainer}>
          <MagicalButton
            title={isVoiceChatConnected ? t('settings.sections.voice.disconnectVoiceChat') : t('settings.sections.voice.connectVoiceChat')}
            onPress={toggleVoiceChat}
            variant={isVoiceChatConnected ? "secondary" : "primary"}
            size="small"
          />
          {isVoiceChatConnected && (
            <View style={styles.voiceChatStatus}>
              <Text style={[styles.voiceChatStatusText, { color: colors.accent, fontFamily: fonts.body }]}>
                {t('settings.sections.voice.voiceChatConnected')}
              </Text>
            </View>
          )}
        </View>
      )}

      {(voiceError || voiceChatError) && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.body }]}>
            {voiceError || voiceChatError}
          </Text>
        </View>
      )}

      {!isLiveKitAvailable && userPreferences.realTimeChatEnabled && (
        <View style={styles.warningContainer}>
          <Text style={[styles.warningText, { color: colors.warning, fontFamily: fonts.body }]}>
            {t('settings.sections.voice.warning')}
          </Text>
        </View>
      )}
    </MysticalCard>
  );

  const renderPreferences = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.preferences.title')}
      </Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Volume2 color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.soundEffects.title')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.soundEffects.subtitle')}
            </Text>
          </View>
        </View>
        <Switch
          value={userPreferences.soundEnabled}
          onValueChange={(value) => updatePreferences({ soundEnabled: value })}
          trackColor={{ false: colors.surface, true: colors.accent }}
          thumbColor={colors.text}
        />
      </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Vibrate color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.hapticFeedback.title')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.hapticFeedback.subtitle')}
            </Text>
          </View>
        </View>
        <Switch
          value={userPreferences.hapticsEnabled}
          onValueChange={(value) => updatePreferences({ hapticsEnabled: value })}
          trackColor={{ false: colors.surface, true: colors.accent }}
          thumbColor={colors.text}
        />
      </View>
    </MysticalCard>
  );

  const renderSubscription = () => (
    <MysticalCard glowColor={colors.accent} style={styles.sectionCard}>
      <View style={styles.subscriptionHeader}>
        <Crown color={colors.accent} size={24} />
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
          {t('settings.sections.subscription.title')}
        </Text>
      </View>
      
      <View style={styles.subscriptionStatus}>
        <Text style={[styles.subscriptionTier, { color: colors.accent, fontFamily: fonts.title }]}>
          {userPreferences.subscriptionTier.toUpperCase()} TIER
        </Text>
        <Text style={[styles.subscriptionDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {userPreferences.subscriptionTier === 'free' 
            ? t('settings.sections.subscription.description.free')
            : t('settings.sections.subscription.description.premium')
          }
        </Text>
      </View>

      {userPreferences.subscriptionTier === 'free' && (
        <MagicalButton
          title={t('settings.sections.subscription.upgrade')}
          onPress={() => {
            // Navigate to premium screen
            console.log('Navigate to premium');
          }}
          style={styles.upgradeButton}
        />
      )}
    </MysticalCard>
  );

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <StarField />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
            {t('settings.title')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('settings.subtitle')}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderLanguageSettings()}
          {renderPersonaSelector()}
          {renderVoiceSettings()}
          {renderPreferences()}
          {renderSubscription()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  languageSelector: {
    marginTop: 8,
  },
  personaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  personaOption: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  personaAvatar: {
    marginBottom: 8,
  },
  personaName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  serviceStatusContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceStatusTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceStatusLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  serviceStatusValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  voiceTestContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  voiceTestNote: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  voiceChatContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  voiceChatStatus: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  voiceChatStatusText: {
    fontSize: 12,
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  warningContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  warningText: {
    fontSize: 12,
    textAlign: 'center',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionStatus: {
    marginBottom: 16,
  },
  subscriptionTier: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subscriptionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  upgradeButton: {
    alignSelf: 'center',
  },
});