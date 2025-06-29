import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Crown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { VoiceChatButton } from '@/components/ui/VoiceChatButton';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WhimsicalOmen, OmenCategory } from '@/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { 
    selectedPersona, 
    userPreferences, 
    addOmen, 
    playOmenVoice, 
    stopVoice, 
    isPlayingVoice,
    voiceError,
    isVoiceServiceAvailable,
    omenHistory
  } = useOracle();
  const [currentOmen, setCurrentOmen] = useState<WhimsicalOmen | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(false);

  // Check if user has reached daily limit (free tier)
  const dailyReadings = omenHistory.filter(omen => {
    const today = new Date();
    const omenDate = new Date(omen.timestamp);
    return omenDate.toDateString() === today.toDateString();
  }).length;

  const dailyLimit = userPreferences.subscriptionTier === 'free' ? 3 : Infinity;
  const hasReachedLimit = dailyReadings >= dailyLimit && userPreferences.subscriptionTier === 'free';

  const generateOmen = async () => {
    if (hasReachedLimit) {
      setShowUpgradeNotification(true);
      return;
    }

    setIsGenerating(true);
    
    // Stop any currently playing voice
    await stopVoice();
    
    // Simulate mystical generation time
    setTimeout(async () => {
      const categories: OmenCategory[] = ['career', 'relationships', 'health', 'creativity', 'finance', 'growth'];
      const symbols = ['🌟', '🔮', '🌙', '⚡', '🦋', '🕊️', '🌸', '🔥', '💎', '🌊'];
      
      // Enhanced phrases based on subscription tier
      const crypticPhrases = userPreferences.subscriptionTier === 'free' ? [
        'The digital ravens whisper of unexpected connections',
        'Silver threads weave through the fabric of tomorrow',
        'Ancient wisdom flows through modern channels',
      ] : [
        'The cosmic symphony resonates with your soul\'s deepest yearnings',
        'Ethereal guardians dance around the threads of your destiny',
        'The universe conspires to unveil the sacred mysteries within',
        'Celestial energies align to illuminate your path forward',
        'The ancient ones speak through the veil of time and space',
      ];

      const interpretations = userPreferences.subscriptionTier === 'free' ? [
        'A message from beyond the veil suggests transformation approaches',
        'The universe conspires to bring clarity to confusion',
        'Hidden opportunities emerge from unexpected places',
      ] : [
        'The cosmic forces have aligned to reveal a profound truth about your journey',
        'Your spiritual guides are orchestrating synchronicities to guide your path',
        'The universe is preparing to bestow upon you a gift of divine insight',
        'Ancient wisdom keepers are opening doorways to new possibilities',
        'The celestial realm is weaving magic into your earthly experience',
      ];

      const advice = userPreferences.subscriptionTier === 'free' ? [
        'Trust your intuition and take the first step forward',
        'Pay attention to synchronicities appearing in your life',
        'Release what no longer serves your highest good',
      ] : [
        'Embrace the sacred dance between surrender and intentional action',
        'Allow your heart\'s wisdom to guide you through this mystical transformation',
        'Trust in the divine timing of the universe\'s grand design for your life',
        'Open yourself to receive the abundant blessings flowing toward you',
        'Step boldly into your power as a co-creator with the cosmic forces',
      ];

      const newOmen: WhimsicalOmen = {
        id: Date.now().toString(),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        crypticPhrase: crypticPhrases[Math.floor(Math.random() * crypticPhrases.length)],
        interpretation: interpretations[Math.floor(Math.random() * interpretations.length)],
        advice: advice[Math.floor(Math.random() * advice.length)],
        timestamp: new Date(),
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        category: categories[Math.floor(Math.random() * categories.length)],
        persona: selectedPersona.id,
      };

      setCurrentOmen(newOmen);
      await addOmen(newOmen);
      setIsGenerating(false);
    }, 2000);
  };

  const handleVoiceToggle = async () => {
    if (isPlayingVoice) {
      await stopVoice();
    } else if (currentOmen) {
      const fullText = `${currentOmen.crypticPhrase}. ${currentOmen.interpretation}. ${currentOmen.advice}`;
      await playOmenVoice(fullText, selectedPersona.voiceStyle);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Seeker';
    if (hour < 18) return 'Good Afternoon, Traveler';
    return 'Good Evening, Mystic';
  };

  const renderDailyProgress = () => {
    if (userPreferences.subscriptionTier !== 'free') return null;

    return (
      <MysticalCard style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.text, fontFamily: fonts.body }]}>
            Daily Readings
          </Text>
          <Text style={[styles.progressCount, { color: colors.accent, fontFamily: fonts.body }]}>
            {dailyReadings}/{dailyLimit}
          </Text>
        </View>
        <ProgressBar 
          progress={dailyReadings / dailyLimit} 
          color={hasReachedLimit ? colors.warning : colors.accent}
        />
        {hasReachedLimit && (
          <Text style={[styles.limitText, { color: colors.warning, fontFamily: fonts.body }]}>
            Daily limit reached. Upgrade for unlimited readings!
          </Text>
        )}
      </MysticalCard>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <StarField />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.greeting, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
              The Whimsical Oracle
            </Text>
          </View>

          {/* Upgrade Notification */}
          {showUpgradeNotification && (
            <NotificationCard
              type="mystical"
              title="Daily Limit Reached"
              message="You've reached your daily reading limit. Upgrade to Premium for unlimited mystical guidance!"
              onDismiss={() => setShowUpgradeNotification(false)}
              actionText="Upgrade Now"
              onAction={() => {
                setShowUpgradeNotification(false);
                // Navigate to premium screen
              }}
            />
          )}

          {/* Voice Service Warning */}
          {!isVoiceServiceAvailable && (
            <NotificationCard
              type="warning"
              title="Voice Features Limited"
              message="Voice features are not fully available on this platform. For complete voice functionality, use a custom development build."
              onDismiss={() => {}}
            />
          )}

          {/* Daily Progress */}
          {renderDailyProgress()}

          {/* Oracle Persona Display */}
          <MysticalCard glowColor={selectedPersona.colorScheme.accent} style={styles.personaCard}>
            <View style={styles.personaContent}>
              <Text style={[styles.personaAvatar, { fontSize: 60 }]}>
                {selectedPersona.avatar}
              </Text>
              <Text style={[styles.personaName, { color: colors.text, fontFamily: fonts.title }]}>
                {selectedPersona.name}
              </Text>
              <Text style={[styles.personaDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {selectedPersona.description}
              </Text>
              {userPreferences.subscriptionTier !== 'free' && (
                <View style={styles.premiumBadge}>
                  <Crown color={colors.accent} size={16} />
                  <Text style={[styles.premiumText, { color: colors.accent, fontFamily: fonts.body }]}>
                    {userPreferences.subscriptionTier.toUpperCase()} MEMBER
                  </Text>
                </View>
              )}
            </View>
          </MysticalCard>

          {/* Voice Chat Button */}
          {userPreferences.realTimeChatEnabled && (
            <View style={styles.voiceChatContainer}>
              <VoiceChatButton />
            </View>
          )}

          {/* Omen Display or Generation */}
          {currentOmen ? (
            <MysticalCard style={styles.omenCard}>
              <View style={styles.omenContent}>
                <View style={styles.omenHeader}>
                  <Text style={[styles.omenSymbol, { fontSize: 48 }]}>
                    {currentOmen.symbol}
                  </Text>
                  {userPreferences.voiceEnabled && isVoiceServiceAvailable && (
                    <TouchableOpacity
                      onPress={handleVoiceToggle}
                      style={[styles.voiceButton, { borderColor: colors.accent }]}
                    >
                      {isPlayingVoice ? (
                        <VolumeX color={colors.accent} size={20} />
                      ) : (
                        <Volume2 color={colors.accent} size={20} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[styles.omenPhrase, { color: colors.accent, fontFamily: fonts.title }]}>
                  "{currentOmen.crypticPhrase}"
                </Text>
                <Text style={[styles.omenInterpretation, { color: colors.text, fontFamily: fonts.body }]}>
                  {currentOmen.interpretation}
                </Text>
                <View style={styles.adviceContainer}>
                  <Text style={[styles.adviceLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                    Mystical Guidance:
                  </Text>
                  <Text style={[styles.advice, { color: colors.text, fontFamily: fonts.body }]}>
                    {currentOmen.advice}
                  </Text>
                </View>
                <View style={styles.omenMeta}>
                  <Text style={[styles.confidence, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                    {Math.round(currentOmen.confidence * 100)}% cosmic resonance
                  </Text>
                  <Text style={[styles.category, { color: colors.accent, fontFamily: fonts.body }]}>
                    #{currentOmen.category}
                  </Text>
                </View>
                {isPlayingVoice && (
                  <View style={styles.playingIndicator}>
                    <Text style={[styles.playingText, { color: colors.accent, fontFamily: fonts.body }]}>
                      🎵 Oracle speaking...
                    </Text>
                  </View>
                )}
                {voiceError && (
                  <View style={styles.errorIndicator}>
                    <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.body }]}>
                      {voiceError}
                    </Text>
                  </View>
                )}
              </View>
            </MysticalCard>
          ) : (
            <MysticalCard style={styles.omenCard}>
              <View style={styles.emptyOmenContent}>
                <Text style={[styles.emptyOmenSymbol, { fontSize: 80 }]}>🔮</Text>
                <Text style={[styles.emptyOmenText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  The Oracle awaits your presence...
                </Text>
                <Text style={[styles.emptyOmenSubtext, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  Touch the crystal to receive your mystical guidance
                </Text>
              </View>
            </MysticalCard>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <MagicalButton
              title={isGenerating ? "Consulting the Stars..." : "Receive Oracle"}
              onPress={generateOmen}
              disabled={isGenerating || hasReachedLimit}
              size="large"
              style={styles.oracleButton}
            />
            
            {hasReachedLimit && (
              <TouchableOpacity style={styles.upgradeHint}>
                <Crown color={colors.accent} size={16} />
                <Text style={[styles.upgradeHintText, { color: colors.accent, fontFamily: fonts.body }]}>
                  Upgrade for unlimited daily omens
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
  },
  progressCard: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  limitText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  personaCard: {
    marginBottom: 24,
  },
  personaContent: {
    alignItems: 'center',
  },
  personaAvatar: {
    marginBottom: 12,
  },
  personaName: {
    fontSize: 24,
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  voiceChatContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  omenCard: {
    marginBottom: 32,
    minHeight: 280,
  },
  omenContent: {
    alignItems: 'center',
  },
  omenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%',
  },
  omenSymbol: {
    flex: 1,
    textAlign: 'center',
  },
  voiceButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  omenPhrase: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  omenInterpretation: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  adviceContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 16,
  },
  adviceLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  advice: {
    fontSize: 16,
    lineHeight: 22,
  },
  omenMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  confidence: {
    fontSize: 12,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
  },
  playingIndicator: {
    padding: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  playingText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorIndicator: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyOmenContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyOmenSymbol: {
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyOmenText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyOmenSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  oracleButton: {
    alignSelf: 'center',
    minWidth: width * 0.6,
  },
  upgradeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
  },
  upgradeHintText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 8,
  },
});