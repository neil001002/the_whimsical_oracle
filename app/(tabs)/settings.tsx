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
  Globe,
  TestTube,
  Info
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { BoltBadge } from '@/components/ui/BoltBadge';
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
    testVoice,
    getVoiceServiceStatus,
  } = useOracle();

  const voiceStatus = getVoiceServiceStatus();

  const testVoiceFunction = async () => {
    if (isPlayingVoice) {
      await stopVoice();
    } else {
      const testText = t('settings.voice.testMessage', 'Greetings, seeker. This is how {{persona}} sounds when speaking mystical wisdom.', { 
        persona: selectedPersona.name 
      });
      await playOmenVoice(testText, selectedPersona.id);
    }
  };

  const renderPersonaSelector = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.persona.title', 'Oracle Persona')}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
        {t('settings.sections.persona.subtitle', 'Choose your mystical guide')}
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
              {t(`personas.${persona.id}.name`, persona.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </MysticalCard>
  );

  const renderLanguageSettings = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.language.title', 'Language')}
      </Text>
      
      <LanguageSelector style={styles.languageSelector} />
    </MysticalCard>
  );

  const renderVoiceSettings = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.voice.title', 'Voice & Communication')}
      </Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Mic color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.sections.voice.voiceNarration.title', 'Voice Narration')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.voice.voiceNarration.subtitle', 'Spoken oracle wisdom')}
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

      {/* Enhanced Service Status Information */}
      <View style={styles.serviceStatusContainer}>
        <Text style={[styles.serviceStatusTitle, { color: colors.text, fontFamily: fonts.body }]}>
          {t('settings.sections.voice.serviceStatus', 'Voice Service Status:')}
        </Text>
        
        <View style={styles.serviceStatusItem}>
          <Text style={[styles.serviceStatusLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            ElevenLabs API: 
          </Text>
          <Text style={[
            styles.serviceStatusValue, 
            { 
              color: voiceStatus.elevenLabsAvailable ? colors.success : colors.warning, 
              fontFamily: fonts.body 
            }
          ]}>
            {voiceStatus.elevenLabsAvailable ? 'Available' : 'Not Configured'}
          </Text>
        </View>
        
        <View style={styles.serviceStatusItem}>
          <Text style={[styles.serviceStatusLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            Native TTS: 
          </Text>
          <Text style={[
            styles.serviceStatusValue, 
            { 
              color: voiceStatus.nativeTTSAvailable ? colors.success : colors.error, 
              fontFamily: fonts.body 
            }
          ]}>
            {voiceStatus.nativeTTSAvailable ? 'Available' : 'Not Available'}
          </Text>
        </View>

        <View style={styles.serviceStatusItem}>
          <Text style={[styles.serviceStatusLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            Platform: 
          </Text>
          <Text style={[styles.serviceStatusValue, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {voiceStatus.platform}
          </Text>
        </View>

        {!voiceStatus.hasApiKey && (
          <View style={styles.infoContainer}>
            <Info color={colors.info} size={16} />
            <Text style={[styles.infoText, { color: colors.info, fontFamily: fonts.body }]}>
              Add EXPO_PUBLIC_ELEVENLABS_API_KEY to your .env file for premium AI voices
            </Text>
          </View>
        )}
      </View>

      {userPreferences.voiceEnabled && (
        <View style={styles.voiceTestContainer}>
          <MagicalButton
            title={isPlayingVoice ? t('settings.sections.voice.stopVoice', 'Stop Voice Test') : t('settings.sections.voice.testVoice', 'Test Voice')}
            onPress={testVoiceFunction}
            variant="secondary"
            size="small"
          />
          <Text style={[styles.voiceTestNote, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('settings.sections.voice.testNote', 'Test how your selected oracle sounds')}
          </Text>
          
          {/* Advanced Voice Test */}
          <MagicalButton
            title="Advanced Voice Test"
            onPress={testVoice}
            variant="ghost"
            size="small"
            style={styles.advancedTestButton}
          />
        </View>
      )}

      {voiceError && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.body }]}>
            {voiceError}
          </Text>
        </View>
      )}
    </MysticalCard>
  );

  const renderPreferences = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('settings.sections.preferences.title', 'Mystical Preferences')}
      </Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Volume2 color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.soundEffects.title', 'Sound Effects')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.soundEffects.subtitle', 'Mystical audio feedback')}
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
              {t('settings.sections.preferences.hapticFeedback.title', 'Haptic Feedback')}
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('settings.sections.preferences.hapticFeedback.subtitle', 'Tactile mystical sensations')}
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
          {t('settings.sections.subscription.title', 'Subscription Status')}
        </Text>
      </View>
      
      <View style={styles.subscriptionStatus}>
        <Text style={[styles.subscriptionTier, { color: colors.accent, fontFamily: fonts.title }]}>
          {userPreferences.subscriptionTier.toUpperCase()} {t('premium.tier', 'TIER')}
        </Text>
        <Text style={[styles.subscriptionDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {userPreferences.subscriptionTier === 'free' 
            ? t('settings.sections.subscription.description.free', 'Access to basic oracle features')
            : t('settings.sections.subscription.description.premium', 'Full access to all mystical powers')
          }
        </Text>
      </View>

      {userPreferences.subscriptionTier === 'free' && (
        <MagicalButton
          title={t('settings.sections.subscription.upgrade', 'Unlock Mystical Powers')}
          onPress={() => {
            // Navigate to premium screen
            console.log('Navigate to premium');
          }}
          style={styles.upgradeButton}
        />
      )}
    </MysticalCard>
  );

  const renderBoltBadge = () => (
    <View style={styles.badgeContainer}>
      <BoltBadge variant="cosmic" size="medium" />
    </View>
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
            {t('settings.title', 'Mystical Settings')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('settings.subtitle', 'Configure your oracle experience')}
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
          {renderBoltBadge()}
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoText: {
    fontSize: 11,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
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
  advancedTestButton: {
    marginTop: 8,
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
  badgeContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});