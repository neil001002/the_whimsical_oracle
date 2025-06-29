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
import { router } from 'expo-router';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { ORACLE_PERSONAS } from '@/constants/OraclePersonas';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { colors, fonts } = useTheme();
  const { updateProfile } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState(ORACLE_PERSONAS[0].id);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      await updateProfile({
        preferences: {
          selectedPersona,
          soundEnabled: true,
          hapticsEnabled: true,
          voiceEnabled: true,
          realTimeChatEnabled: true,
        },
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
              Choose Your Oracle Guide
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Select the mystical persona that resonates with your cosmic energy
            </Text>
          </View>

          {/* Persona Selection */}
          <View style={styles.personaContainer}>
            {ORACLE_PERSONAS.map((persona) => (
              <TouchableOpacity
                key={persona.id}
                onPress={() => setSelectedPersona(persona.id)}
                style={styles.personaWrapper}
              >
                <MysticalCard
                  glowColor={selectedPersona === persona.id ? persona.colorScheme.accent : undefined}
                  animated={selectedPersona === persona.id}
                  style={[
                    styles.personaCard,
                    selectedPersona === persona.id && {
                      borderColor: persona.colorScheme.accent,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <View style={styles.personaContent}>
                    <Text style={[styles.personaAvatar, { fontSize: 60 }]}>
                      {persona.avatar}
                    </Text>
                    <Text style={[styles.personaName, { color: colors.text, fontFamily: fonts.title }]}>
                      {persona.name}
                    </Text>
                    <Text style={[styles.personaDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                      {persona.description}
                    </Text>
                    
                    {selectedPersona === persona.id && (
                      <View style={[styles.selectedBadge, { backgroundColor: persona.colorScheme.accent }]}>
                        <Sparkles color={colors.background} size={16} />
                        <Text style={[styles.selectedText, { color: colors.background, fontFamily: fonts.body }]}>
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>
                </MysticalCard>
              </TouchableOpacity>
            ))}
          </View>

          {/* Welcome Message */}
          <MysticalCard style={styles.welcomeCard}>
            <View style={styles.welcomeContent}>
              <Text style={[styles.welcomeTitle, { color: colors.text, fontFamily: fonts.title }]}>
                Welcome to The Whimsical Oracle
              </Text>
              <Text style={[styles.welcomeText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                Your mystical journey begins now. Your chosen oracle guide will provide cosmic wisdom, 
                mystical insights, and spiritual guidance tailored to your unique path.
              </Text>
              
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🔮</Text>
                  <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
                    Daily mystical readings
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🎙️</Text>
                  <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
                    Voice-guided wisdom
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📚</Text>
                  <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
                    Personal omen history
                  </Text>
                </View>
              </View>
            </View>
          </MysticalCard>

          {/* Complete Button */}
          <MagicalButton
            title={loading ? "Preparing Your Mystical Journey..." : "Begin My Cosmic Journey"}
            onPress={handleComplete}
            disabled={loading}
            variant="golden"
            size="large"
            style={styles.completeButton}
            glowing={!loading}
          />
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
    paddingVertical: 40,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  personaContainer: {
    marginBottom: 30,
  },
  personaWrapper: {
    marginBottom: 20,
  },
  personaCard: {
    position: 'relative',
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
    fontSize: 22,
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  welcomeCard: {
    marginBottom: 40,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.9,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  completeButton: {
    alignSelf: 'center',
    minWidth: width * 0.8,
  },
});