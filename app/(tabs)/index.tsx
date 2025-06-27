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
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { WhimsicalOmen, OmenCategory } from '@/types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { selectedPersona, userPreferences, addOmen } = useOracle();
  const [currentOmen, setCurrentOmen] = useState<WhimsicalOmen | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOmen = async () => {
    setIsGenerating(true);
    
    // Simulate mystical generation time
    setTimeout(() => {
      const categories: OmenCategory[] = ['career', 'relationships', 'health', 'creativity', 'finance', 'growth'];
      const symbols = ['🌟', '🔮', '🌙', '⚡', '🦋', '🕊️', '🌸', '🔥', '💎', '🌊'];
      const crypticPhrases = [
        'The digital ravens whisper of unexpected connections',
        'Silver threads weave through the fabric of tomorrow',
        'Ancient wisdom flows through modern channels',
        'The cosmic dance reveals hidden patterns',
        'Stars align to illuminate forgotten paths',
      ];
      const interpretations = [
        'A message from beyond the veil suggests transformation approaches',
        'The universe conspires to bring clarity to confusion',
        'Hidden opportunities emerge from unexpected places',
        'Past wisdom illuminates present challenges',
        'New beginnings await those who trust the process',
      ];
      const advice = [
        'Trust your intuition and take the first step forward',
        'Pay attention to synchronicities appearing in your life',
        'Release what no longer serves your highest good',
        'Embrace change as the universe\'s gift to your growth',
        'Connect with others who share your mystical journey',
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
      addOmen(newOmen);
      setIsGenerating(false);
    }, 2000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning, Seeker';
    if (hour < 18) return 'Good Afternoon, Traveler';
    return 'Good Evening, Mystic';
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
            </View>
          </MysticalCard>

          {/* Omen Display or Generation */}
          {currentOmen ? (
            <MysticalCard style={styles.omenCard}>
              <View style={styles.omenContent}>
                <Text style={[styles.omenSymbol, { fontSize: 48 }]}>
                  {currentOmen.symbol}
                </Text>
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
                  Touch the crystal to receive your daily guidance
                </Text>
              </View>
            </MysticalCard>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <MagicalButton
              title={isGenerating ? "Consulting the Stars..." : "Receive Oracle"}
              onPress={generateOmen}
              disabled={isGenerating}
              size="large"
              style={styles.oracleButton}
            />
            
            {currentOmen && userPreferences.subscriptionTier === 'free' && (
              <TouchableOpacity style={styles.premiumHint}>
                <Text style={[styles.premiumHintText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  ✨ Upgrade for unlimited daily omens
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
  },
  omenCard: {
    marginBottom: 32,
    minHeight: 280,
  },
  omenContent: {
    alignItems: 'center',
  },
  omenSymbol: {
    marginBottom: 16,
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
  premiumHint: {
    marginTop: 16,
    padding: 12,
  },
  premiumHintText: {
    fontSize: 14,
    textAlign: 'center',
  },
});