import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Crown, Sparkles, Video, X } from 'lucide-react-native';
import * as Crypto from 'expo-crypto';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useVideoOracle } from '@/contexts/VideoOracleContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { VoiceChatButton } from '@/components/ui/VoiceChatButton';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { OrnateFrame } from '@/components/ui/OrnateFrame';
import { SubscriptionBanner } from '@/components/subscription/SubscriptionBanner';
import { VideoOracleViewer } from '@/components/ui/VideoOracleViewer';
import { VideoOracleButton } from '@/components/ui/VideoOracleButton';
import { WhimsicalOmen, OmenCategory } from '@/types';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { t } = useLanguage();
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
  const { subscriptionStatus, canAccessPremiumFeatures } = useSubscription();
  const {
    isTavusAvailable,
    activeSession,
    isConnecting,
    isConnected,
    error: videoError,
    startVideoSession,
    endVideoSession,
    clearError,
    isPersonaVideoEnabled,
  } = useVideoOracle();
  
  const [currentOmen, setCurrentOmen] = useState<WhimsicalOmen | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Check if user has reached daily limit (free tier)
  const dailyReadings = omenHistory.filter(omen => {
    const today = new Date();
    const omenDate = new Date(omen.timestamp);
    return omenDate.toDateString() === today.toDateString();
  }).length;

  const dailyLimit = subscriptionStatus.tier === 'free' ? 3 : Infinity;
  const hasReachedLimit = dailyReadings >= dailyLimit && subscriptionStatus.tier === 'free';

  const generateOmen = async () => {
    console.log('Generate omen button pressed!');
    
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
      const symbols = ['🌟', '🔮', '🌙', '⚡', '🦋', '🕊️', '🌸', '🔥', '💎', '🌊', '✨', '🌌', '🔯', '🌺', '🦄'];
      
      // Enhanced phrases based on subscription tier
      const crypticPhrases = subscriptionStatus.tier === 'free' ? [
        t('oracle.phrases.basic.1', 'The digital ravens whisper of unexpected connections'),
        t('oracle.phrases.basic.2', 'Silver threads weave through the fabric of tomorrow'),
        t('oracle.phrases.basic.3', 'Ancient wisdom flows through modern channels'),
        t('oracle.phrases.basic.4', 'The cosmic dance reveals hidden patterns'),
        t('oracle.phrases.basic.5', 'Stars align to illuminate forgotten paths'),
      ] : [
        t('oracle.phrases.premium.1', 'The cosmic symphony resonates with your soul\'s deepest yearnings'),
        t('oracle.phrases.premium.2', 'Ethereal guardians dance around the threads of your destiny'),
        t('oracle.phrases.premium.3', 'The universe conspires to unveil the sacred mysteries within'),
        t('oracle.phrases.premium.4', 'Celestial energies align to illuminate your path forward'),
        t('oracle.phrases.premium.5', 'The ancient ones speak through the veil of time and space'),
        t('oracle.phrases.premium.6', 'Stardust memories awaken the dormant magic in your heart'),
        t('oracle.phrases.premium.7', 'The celestial tapestry weaves new possibilities into existence'),
        t('oracle.phrases.premium.8', 'Divine frequencies harmonize with your spiritual essence'),
      ];

      const interpretations = subscriptionStatus.tier === 'free' ? [
        t('oracle.interpretations.basic.1', 'A message from beyond the veil suggests transformation approaches'),
        t('oracle.interpretations.basic.2', 'The universe conspires to bring clarity to confusion'),
        t('oracle.interpretations.basic.3', 'Hidden opportunities emerge from unexpected places'),
        t('oracle.interpretations.basic.4', 'Past wisdom illuminates present challenges'),
        t('oracle.interpretations.basic.5', 'New beginnings await those who trust the process'),
      ] : [
        t('oracle.interpretations.premium.1', 'The cosmic forces have aligned to reveal a profound truth about your journey'),
        t('oracle.interpretations.premium.2', 'Your spiritual guides are orchestrating synchronicities to guide your path'),
        t('oracle.interpretations.premium.3', 'The universe is preparing to bestow upon you a gift of divine insight'),
        t('oracle.interpretations.premium.4', 'Ancient wisdom keepers are opening doorways to new possibilities'),
        t('oracle.interpretations.premium.5', 'The celestial realm is weaving magic into your earthly experience'),
        t('oracle.interpretations.premium.6', 'Sacred geometry patterns are manifesting in your reality'),
        t('oracle.interpretations.premium.7', 'The quantum field responds to your elevated consciousness'),
        t('oracle.interpretations.premium.8', 'Multidimensional energies converge to support your highest good'),
      ];

      const advice = subscriptionStatus.tier === 'free' ? [
        t('oracle.advice.basic.1', 'Trust your intuition and take the first step forward'),
        t('oracle.advice.basic.2', 'Pay attention to synchronicities appearing in your life'),
        t('oracle.advice.basic.3', 'Release what no longer serves your highest good'),
        t('oracle.advice.basic.4', 'Embrace change as the universe\'s gift to your growth'),
        t('oracle.advice.basic.5', 'Connect with others who share your mystical journey'),
      ] : [
        t('oracle.advice.premium.1', 'Embrace the sacred dance between surrender and intentional action'),
        t('oracle.advice.premium.2', 'Allow your heart\'s wisdom to guide you through this mystical transformation'),
        t('oracle.advice.premium.3', 'Trust in the divine timing of the universe\'s grand design for your life'),
        t('oracle.advice.premium.4', 'Open yourself to receive the abundant blessings flowing toward you'),
        t('oracle.advice.premium.5', 'Step boldly into your power as a co-creator with the cosmic forces'),
        t('oracle.advice.premium.6', 'Activate your inner oracle through meditation and sacred rituals'),
        t('oracle.advice.premium.7', 'Channel the celestial energies into manifestation of your dreams'),
        t('oracle.advice.premium.8', 'Align with the cosmic currents that carry you toward your destiny'),
      ];

      const newOmen: WhimsicalOmen = {
        id: Crypto.randomUUID(),
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
    }, 2500);
  };

  const handleVoiceToggle = async () => {
    if (isPlayingVoice) {
      await stopVoice();
    } else if (currentOmen) {
      const fullText = `${currentOmen.crypticPhrase}. ${currentOmen.interpretation}. ${currentOmen.advice}`;
      await playOmenVoice(fullText, selectedPersona.voiceStyle);
    }
  };

  const handleVideoOracleToggle = async () => {
    if (!canAccessPremiumFeatures) {
      setShowUpgradeNotification(true);
      return;
    }

    if (isConnected) {
      await endVideoSession();
      setShowVideoModal(false);
    } else {
      try {
        await startVideoSession(selectedPersona.id);
        setShowVideoModal(true);
      } catch (error) {
        console.error('Failed to start video session:', error);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning', 'Good Morning, Seeker');
    if (hour < 18) return t('home.greeting.afternoon', 'Good Afternoon, Traveler');
    return t('home.greeting.evening', 'Good Evening, Mystic');
  };

  const renderDailyProgress = () => {
    if (subscriptionStatus.tier !== 'free') return null;

    return (
      <MysticalCard variant="ethereal" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: colors.text, fontFamily: fonts.body }]}>
            {t('home.dailyReadings.title', 'Daily Mystical Readings')}
          </Text>
          <Text style={[styles.progressCount, { color: colors.accent, fontFamily: fonts.title }]}>
            {dailyReadings}/{dailyLimit}
          </Text>
        </View>
        <ProgressBar 
          progress={dailyReadings / dailyLimit} 
          color={hasReachedLimit ? colors.warning : colors.accent}
          animated={true}
        />
        {hasReachedLimit && (
          <View style={styles.limitContainer}>
            <Sparkles color={colors.warning} size={16} />
            <Text style={[styles.limitText, { color: colors.warning, fontFamily: fonts.body }]}>
              {t('home.dailyReadings.limitReached', 'Daily limit reached. Upgrade for unlimited mystical guidance!')}
            </Text>
          </View>
        )}
      </MysticalCard>
    );
  };

  const renderVideoModal = () => (
    <Modal
      visible={showVideoModal}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setShowVideoModal(false)}
    >
      <LinearGradient
        colors={colors.gradients.cosmic}
        style={styles.modalContainer}
      >
        <StarField />
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text, fontFamily: fonts.title }]}>
              {t('home.videoOracle.title', 'Video Oracle Session')}
            </Text>
            <TouchableOpacity
              onPress={() => setShowVideoModal(false)}
              style={[styles.closeButton, { borderColor: colors.accent }]}
            >
              <X color={colors.accent} size={24} />
            </TouchableOpacity>
          </View>
          
          {activeSession && (
            <View style={styles.videoContainer}>
              <VideoOracleViewer
                conversationUrl={activeSession.conversationUrl}
                onConnectionStateChange={(connected) => {
                  if (!connected && activeSession) {
                    setShowVideoModal(false);
                  }
                }}
                onError={(error) => {
                  console.error('Video oracle error:', error);
                  setShowVideoModal(false);
                }}
                style={styles.videoViewer}
              />
            </View>
          )}
          
          <View style={styles.modalControls}>
            <VideoOracleButton
              onPress={handleVideoOracleToggle}
              isConnected={isConnected}
              isLoading={isConnecting}
              disabled={!isTavusAvailable}
              style={styles.videoControlButton}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );

  return (
    <LinearGradient
      colors={colors.gradients.cosmic}
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
              {t('home.title', 'The Whimsical Oracle')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textTertiary, fontFamily: fonts.body }]}>
              {t('home.subtitle', 'Where cosmic wisdom meets earthly guidance')}
            </Text>
          </View>

          {/* Subscription Banner */}
          {!canAccessPremiumFeatures && (
            <SubscriptionBanner
              onUpgrade={() => router.push('/(tabs)/premium')}
              message={t('home.subscriptionBanner.message', 'Unlock unlimited mystical wisdom and premium features!')}
            />
          )}

          {/* Upgrade Notification */}
          {showUpgradeNotification && (
            <NotificationCard
              type="mystical"
              title={t('home.notifications.limitReached.title', '✨ Mystical Limit Reached')}
              message={t('home.notifications.limitReached.message', 'You\'ve reached your daily reading limit. Upgrade to Premium for unlimited cosmic guidance and enhanced mystical features!')}
              onDismiss={() => setShowUpgradeNotification(false)}
              actionText={t('home.notifications.limitReached.action', 'Unlock Mystical Powers')}
              onAction={() => {
                setShowUpgradeNotification(false);
                router.push('/(tabs)/premium');
              }}
            />
          )}

          {/* Voice Service Warning */}
          {!isVoiceServiceAvailable && (
            <NotificationCard
              type="warning"
              title={t('home.notifications.voiceWarning.title', 'Voice Features Limited')}
              message={t('home.notifications.voiceWarning.message', 'Voice features are not fully available on this platform. For complete mystical voice functionality, use a custom development build.')}
              onDismiss={() => {}}
            />
          )}

          {/* Video Error */}
          {videoError && (
            <NotificationCard
              type="warning"
              title={t('home.notifications.videoError.title', 'Video Oracle Issue')}
              message={videoError}
              onDismiss={clearError}
            />
          )}

          {/* Daily Progress */}
          {renderDailyProgress()}

          {/* Oracle Persona Display */}
          <OrnateFrame variant="cosmic" size="large">
            <MysticalCard 
              glowColor={selectedPersona.colorScheme.accent} 
              variant="ethereal" 
              animated={true}
              style={styles.personaCard}
            >
              <View style={styles.personaContent}>
                <Text style={[styles.personaAvatar, { fontSize: 80 }]}>
                  {selectedPersona.avatar}
                </Text>
                <Text style={[styles.personaName, { color: colors.text, fontFamily: fonts.title }]}>
                  {t(`personas.${selectedPersona.id}.name`, selectedPersona.name)}
                </Text>
                <Text style={[styles.personaDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  {t(`personas.${selectedPersona.id}.description`, selectedPersona.description)}
                </Text>
                {subscriptionStatus.tier !== 'free' && (
                  <View style={[styles.premiumBadge, { backgroundColor: colors.glassGolden, borderColor: colors.borderGolden }]}>
                    <Crown color={colors.accent} size={16} />
                    <Text style={[styles.premiumText, { color: colors.accent, fontFamily: fonts.body }]}>
                      {subscriptionStatus.tier.toUpperCase()} {t('home.persona.mystic', 'MYSTIC')}
                    </Text>
                  </View>
                )}
              </View>
            </MysticalCard>
          </OrnateFrame>

          {/* Interactive Features */}
          <View style={styles.featuresContainer}>
            {/* Voice Chat Button */}
            {userPreferences.realTimeChatEnabled && (
              <View style={styles.featureButton}>
                <VoiceChatButton />
              </View>
            )}

            {/* Video Oracle Button */}
            {isTavusAvailable && isPersonaVideoEnabled(selectedPersona.id) && (
              <TouchableOpacity
                style={[styles.videoOracleButton, { borderColor: colors.accent, backgroundColor: colors.glassGolden }]}
                onPress={handleVideoOracleToggle}
                disabled={isConnecting}
              >
                <Video color={colors.accent} size={20} />
                <Text style={[styles.videoOracleText, { color: colors.accent, fontFamily: fonts.body }]}>
                  {isConnected ? t('home.videoOracle.end', 'End Video') : t('home.videoOracle.start', 'Video Oracle')}
                </Text>
                {!canAccessPremiumFeatures && (
                  <Crown color={colors.accent} size={16} />
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Omen Display or Generation */}
          {currentOmen ? (
            <MysticalCard 
              variant="golden" 
              animated={true} 
              glowColor={colors.accent}
              style={styles.omenCard}
            >
              <View style={styles.omenContent}>
                <View style={styles.omenHeader}>
                  <Text style={[styles.omenSymbol, { fontSize: 64 }]}>
                    {currentOmen.symbol}
                  </Text>
                  {userPreferences.voiceEnabled && isVoiceServiceAvailable && (
                    <TouchableOpacity
                      onPress={handleVoiceToggle}
                      style={[styles.voiceButton, { borderColor: colors.accent, backgroundColor: colors.glassGolden }]}
                    >
                      {isPlayingVoice ? (
                        <VolumeX color={colors.accent} size={20} />
                      ) : (
                        <Volume2 color={colors.accent} size={20} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={[styles.divider, { backgroundColor: colors.borderGolden }]} />
                
                <Text style={[styles.omenPhrase, { color: colors.accent, fontFamily: fonts.title }]}>
                  "{currentOmen.crypticPhrase}"
                </Text>
                
                <Text style={[styles.omenInterpretation, { color: colors.text, fontFamily: fonts.body }]}>
                  {currentOmen.interpretation}
                </Text>
                
                <View style={[styles.adviceContainer, { backgroundColor: colors.glassGolden, borderColor: colors.borderGolden }]}>
                  <View style={styles.adviceHeader}>
                    <Sparkles color={colors.accent} size={16} />
                    <Text style={[styles.adviceLabel, { color: colors.accent, fontFamily: fonts.body }]}>
                      {t('home.omen.guidance', 'Mystical Guidance')}
                    </Text>
                  </View>
                  <Text style={[styles.advice, { color: colors.text, fontFamily: fonts.body }]}>
                    {currentOmen.advice}
                  </Text>
                </View>
                
                <View style={styles.omenMeta}>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: colors.textTertiary, fontFamily: fonts.body }]}>
                      {t('home.omen.resonance', 'Cosmic Resonance')}
                    </Text>
                    <Text style={[styles.confidence, { color: colors.accent, fontFamily: fonts.body }]}>
                      {Math.round(currentOmen.confidence * 100)}%
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: colors.textTertiary, fontFamily: fonts.body }]}>
                      {t('home.omen.category', 'Category')}
                    </Text>
                    <Text style={[styles.category, { color: colors.accentSecondary, fontFamily: fonts.body }]}>
                      #{t(`categories.${currentOmen.category}`, currentOmen.category)}
                    </Text>
                  </View>
                </View>
                
                {isPlayingVoice && (
                  <View style={[styles.playingIndicator, { backgroundColor: colors.glassGolden, borderColor: colors.borderGolden }]}>
                    <Text style={[styles.playingText, { color: colors.accent, fontFamily: fonts.body }]}>
                      {t('home.omen.speaking', '🎵 Oracle speaking mystical wisdom...')}
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
            <MysticalCard variant="ethereal" animated={true} style={styles.omenCard}>
              <View style={styles.emptyOmenContent}>
                <Text style={[styles.emptyOmenSymbol, { fontSize: 100 }]}>🔮</Text>
                <Text style={[styles.emptyOmenText, { color: colors.text, fontFamily: fonts.title }]}>
                  {t('home.oracle.awaits', 'The Oracle Awaits...')}
                </Text>
                <Text style={[styles.emptyOmenSubtext, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  {t('home.oracle.instruction', 'Touch the mystical crystal to receive your cosmic guidance')}
                </Text>
                <View style={styles.mysticalElements}>
                  <Text style={styles.mysticalSymbol}>✨</Text>
                  <Text style={styles.mysticalSymbol}>🌟</Text>
                  <Text style={styles.mysticalSymbol}>✨</Text>
                </View>
              </View>
            </MysticalCard>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <MagicalButton
              title={isGenerating ? t('home.oracle.generating', 'Consulting the Cosmic Forces...') : t('home.oracle.receive', 'Receive Oracle')}
              onPress={generateOmen}
              disabled={isGenerating || hasReachedLimit}
              size="large"
              variant="golden"
              animated={!isGenerating}
              glowing={!hasReachedLimit}
              style={styles.oracleButton}
            />
            
            {hasReachedLimit && (
              <TouchableOpacity 
                style={[styles.upgradeHint, { backgroundColor: colors.glassGolden, borderColor: colors.borderGolden }]}
                onPress={() => router.push('/(tabs)/premium')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={t('home.upgrade.accessibility', 'Unlock unlimited mystical wisdom')}
              >
                <Crown color={colors.accent} size={20} />
                <Text style={[styles.upgradeHintText, { color: colors.accent, fontFamily: fonts.body }]}>
                  {t('home.upgrade.text', 'Unlock unlimited mystical wisdom')}
                </Text>
                <Sparkles color={colors.accent} size={16} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Video Oracle Modal */}
      {renderVideoModal()}
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
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,
  },
  progressCard: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 18,
    fontWeight: '600',
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  limitText: {
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  personaCard: {
    marginBottom: 32,
  },
  personaContent: {
    alignItems: 'center',
  },
  personaAvatar: {
    marginBottom: 16,
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  personaName: {
    fontSize: 28,
    marginBottom: 12,
    letterSpacing: 1,
  },
  personaDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 24,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  featureButton: {
    alignItems: 'center',
  },
  videoOracleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 25,
    gap: 8,
  },
  videoOracleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  omenCard: {
    marginBottom: 40,
    minHeight: 320,
  },
  omenContent: {
    alignItems: 'center',
  },
  omenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  omenSymbol: {
    flex: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(212, 175, 55, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  voiceButton: {
    position: 'absolute',
    right: 0,
    padding: 12,
    borderWidth: 1,
    borderRadius: 25,
  },
  divider: {
    width: '60%',
    height: 1,
    marginBottom: 20,
  },
  omenPhrase: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  omenInterpretation: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
    opacity: 0.95,
  },
  adviceContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adviceLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  advice: {
    fontSize: 16,
    lineHeight: 24,
  },
  omenMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  confidence: {
    fontSize: 14,
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
  },
  playingIndicator: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  playingText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorIndicator: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyOmenContent: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyOmenSymbol: {
    marginBottom: 24,
    opacity: 0.8,
    textShadowColor: 'rgba(157, 78, 221, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  emptyOmenText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  emptyOmenSubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 20,
  },
  mysticalElements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  mysticalSymbol: {
    fontSize: 20,
    opacity: 0.6,
  },
  buttonContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
    ...Platform.select({
      web: {
        zIndex: 100,
        position: 'relative',
      },
    }),
  },
  oracleButton: {
    alignSelf: 'center',
    minWidth: width * 0.7,
    ...Platform.select({
      web: {
        position: 'relative',
        zIndex: 100,
      },
    }),
  },
  upgradeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
        outlineWidth: 0,
        outlineStyle: 'none',
      },
    }),
  },
  upgradeHintText: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 12,
    fontWeight: '500',
    ...Platform.select({
      web: {
        userSelect: 'none',
      },
    }),
  },
  // Video Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  videoContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoViewer: {
    flex: 1,
  },
  modalControls: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  videoControlButton: {
    minWidth: 200,
  },
});