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
  Mic
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { ORACLE_PERSONAS } from '@/constants/OraclePersonas';

export default function SettingsScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { 
    selectedPersona, 
    userPreferences, 
    updatePersona, 
    updatePreferences,
    playOmenVoice,
    stopVoice,
    isPlayingVoice
  } = useOracle();

  const testVoice = async () => {
    if (isPlayingVoice) {
      await stopVoice();
    } else {
      const testText = "Greetings, seeker. This is how your chosen oracle sounds when speaking mystical wisdom.";
      await playOmenVoice(testText, selectedPersona.voiceStyle);
    }
  };

  const renderPersonaSelector = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        Oracle Persona
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
        Choose your mystical guide
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
              {persona.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </MysticalCard>
  );

  const renderPreferences = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        Mystical Preferences
      </Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Volume2 color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              Sound Effects
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Mystical audio feedback
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
              Haptic Feedback
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Tactile mystical sensations
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

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Mic color={colors.accent} size={20} />
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text, fontFamily: fonts.body }]}>
              Voice Narration
            </Text>
            <Text style={[styles.preferenceSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Spoken oracle wisdom
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

      {userPreferences.voiceEnabled && (
        <View style={styles.voiceTestContainer}>
          <MagicalButton
            title={isPlayingVoice ? "Stop Voice Test" : "Test Voice"}
            onPress={testVoice}
            variant="secondary"
            size="small"
          />
          <Text style={[styles.voiceTestNote, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            Test how your selected oracle sounds
          </Text>
        </View>
      )}
    </MysticalCard>
  );

  const renderSubscription = () => (
    <MysticalCard glowColor={colors.accent} style={styles.sectionCard}>
      <View style={styles.subscriptionHeader}>
        <Crown color={colors.accent} size={24} />
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
          Subscription Status
        </Text>
      </View>
      
      <View style={styles.subscriptionStatus}>
        <Text style={[styles.subscriptionTier, { color: colors.accent, fontFamily: fonts.title }]}>
          {userPreferences.subscriptionTier.toUpperCase()} TIER
        </Text>
        <Text style={[styles.subscriptionDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {userPreferences.subscriptionTier === 'free' 
            ? 'Access to basic oracle features'
            : 'Full access to all mystical powers'
          }
        </Text>
      </View>

      {userPreferences.subscriptionTier === 'free' && (
        <MagicalButton
          title="Unlock Mystical Powers"
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
            Mystical Settings
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            Configure your oracle experience
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderPersonaSelector()}
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