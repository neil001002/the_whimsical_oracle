import React from 'react';
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
import { 
  Crown, 
  Star, 
  Zap, 
  Infinity, 
  Shield, 
  Sparkles,
  Check,
  X
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';

const { width } = Dimensions.get('window');

interface PremiumFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  free: boolean;
  premium: boolean;
  mystic: boolean;
}

export default function PremiumScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { userPreferences, updatePreferences } = useOracle();

  const features: PremiumFeature[] = [
    {
      icon: <Zap color={colors.accent} size={24} />,
      title: 'Daily Oracle Readings',
      description: 'Receive mystical guidance every day',
      free: true,
      premium: true,
      mystic: true,
    },
    {
      icon: <Star color={colors.accent} size={24} />,
      title: 'Multiple Oracle Personas',
      description: 'Choose from 5 unique mystical guides',
      free: true,
      premium: true,
      mystic: true,
    },
    {
      icon: <Sparkles color={colors.accent} size={24} />,
      title: 'Voice Narration',
      description: 'Hear your omens spoken aloud',
      free: true,
      premium: true,
      mystic: true,
    },
    {
      icon: <Infinity color={colors.accent} size={24} />,
      title: 'Unlimited Readings',
      description: 'No daily limits on oracle consultations',
      free: false,
      premium: true,
      mystic: true,
    },
    {
      icon: <Crown color={colors.accent} size={24} />,
      title: 'Premium Personas',
      description: 'Access to exclusive mystical guides',
      free: false,
      premium: true,
      mystic: true,
    },
    {
      icon: <Shield color={colors.accent} size={24} />,
      title: 'Advanced Interpretations',
      description: 'Deeper insights and detailed guidance',
      free: false,
      premium: true,
      mystic: true,
    },
    {
      icon: <Sparkles color={colors.accent} size={24} />,
      title: 'Real-time Voice Chat',
      description: 'Interactive conversations with oracles',
      free: false,
      premium: false,
      mystic: true,
    },
    {
      icon: <Star color={colors.accent} size={24} />,
      title: 'Cosmic Calendar',
      description: 'Astrological timing for readings',
      free: false,
      premium: false,
      mystic: true,
    },
  ];

  const plans = [
    {
      id: 'free',
      name: 'Seeker',
      price: 'Free',
      description: 'Begin your mystical journey',
      color: colors.textSecondary,
      features: features.filter(f => f.free),
    },
    {
      id: 'premium',
      name: 'Mystic',
      price: '$4.99/month',
      description: 'Unlock deeper wisdom',
      color: colors.accent,
      features: features.filter(f => f.premium),
      popular: true,
    },
    {
      id: 'mystic',
      name: 'Oracle Master',
      price: '$9.99/month',
      description: 'Complete mystical mastery',
      color: colors.accent,
      features: features.filter(f => f.mystic),
    },
  ];

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with RevenueCat
    console.log(`Upgrading to ${planId} plan`);
    updatePreferences({ 
      subscriptionTier: planId as 'free' | 'premium' | 'mystic' 
    });
  };

  const renderFeatureComparison = () => (
    <MysticalCard style={styles.comparisonCard}>
      <Text style={[styles.comparisonTitle, { color: colors.text, fontFamily: fonts.title }]}>
        Feature Comparison
      </Text>
      
      <View style={styles.comparisonHeader}>
        <View style={styles.featureColumn}>
          <Text style={[styles.columnHeader, { color: colors.text, fontFamily: fonts.body }]}>
            Feature
          </Text>
        </View>
        <View style={styles.planColumn}>
          <Text style={[styles.columnHeader, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            Free
          </Text>
        </View>
        <View style={styles.planColumn}>
          <Text style={[styles.columnHeader, { color: colors.accent, fontFamily: fonts.body }]}>
            Premium
          </Text>
        </View>
        <View style={styles.planColumn}>
          <Text style={[styles.columnHeader, { color: colors.accent, fontFamily: fonts.body }]}>
            Mystic
          </Text>
        </View>
      </View>

      {features.map((feature, index) => (
        <View key={index} style={styles.comparisonRow}>
          <View style={styles.featureColumn}>
            <View style={styles.featureInfo}>
              {feature.icon}
              <Text style={[styles.featureName, { color: colors.text, fontFamily: fonts.body }]}>
                {feature.title}
              </Text>
            </View>
          </View>
          <View style={styles.planColumn}>
            {feature.free ? (
              <Check color={colors.success} size={20} />
            ) : (
              <X color={colors.textSecondary} size={20} />
            )}
          </View>
          <View style={styles.planColumn}>
            {feature.premium ? (
              <Check color={colors.success} size={20} />
            ) : (
              <X color={colors.textSecondary} size={20} />
            )}
          </View>
          <View style={styles.planColumn}>
            {feature.mystic ? (
              <Check color={colors.success} size={20} />
            ) : (
              <X color={colors.textSecondary} size={20} />
            )}
          </View>
        </View>
      ))}
    </MysticalCard>
  );

  const renderPlanCard = (plan: any) => (
    <MysticalCard 
      key={plan.id}
      glowColor={plan.popular ? colors.accent : undefined}
      style={[
        styles.planCard,
        plan.popular && styles.popularPlan,
        userPreferences.subscriptionTier === plan.id && styles.currentPlan,
      ]}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.popularText, { color: colors.background, fontFamily: fonts.body }]}>
            Most Popular
          </Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={[styles.planName, { color: colors.text, fontFamily: fonts.title }]}>
          {plan.name}
        </Text>
        <Text style={[styles.planPrice, { color: plan.color, fontFamily: fonts.title }]}>
          {plan.price}
        </Text>
        <Text style={[styles.planDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {plan.description}
        </Text>
      </View>

      <View style={styles.planFeatures}>
        {plan.features.slice(0, 4).map((feature: PremiumFeature, index: number) => (
          <View key={index} style={styles.planFeature}>
            <Check color={colors.success} size={16} />
            <Text style={[styles.planFeatureText, { color: colors.text, fontFamily: fonts.body }]}>
              {feature.title}
            </Text>
          </View>
        ))}
        {plan.features.length > 4 && (
          <Text style={[styles.moreFeatures, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            +{plan.features.length - 4} more features
          </Text>
        )}
      </View>

      <MagicalButton
        title={
          userPreferences.subscriptionTier === plan.id 
            ? 'Current Plan' 
            : plan.id === 'free' 
              ? 'Current Plan' 
              : 'Upgrade Now'
        }
        onPress={() => handleUpgrade(plan.id)}
        disabled={userPreferences.subscriptionTier === plan.id}
        variant={plan.popular ? 'primary' : 'secondary'}
        style={styles.planButton}
      />
    </MysticalCard>
  );

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
            <Crown color={colors.accent} size={40} />
            <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
              Unlock Mystical Powers
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Choose your path to deeper wisdom
            </Text>
          </View>

          {/* Current Plan Status */}
          <MysticalCard style={styles.statusCard}>
            <View style={styles.statusContent}>
              <Text style={[styles.statusTitle, { color: colors.text, fontFamily: fonts.title }]}>
                Current Plan
              </Text>
              <Text style={[styles.statusPlan, { color: colors.accent, fontFamily: fonts.title }]}>
                {userPreferences.subscriptionTier.toUpperCase()} TIER
              </Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {userPreferences.subscriptionTier === 'free' 
                  ? 'Access to basic oracle features'
                  : userPreferences.subscriptionTier === 'premium'
                    ? 'Enhanced mystical capabilities'
                    : 'Complete oracle mastery'
                }
              </Text>
            </View>
          </MysticalCard>

          {/* Pricing Plans */}
          <View style={styles.plansContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
              Choose Your Mystical Path
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plansScroll}
            >
              {plans.map(renderPlanCard)}
            </ScrollView>
          </View>

          {/* Feature Comparison */}
          {renderFeatureComparison()}

          {/* Benefits Section */}
          <MysticalCard style={styles.benefitsCard}>
            <Text style={[styles.benefitsTitle, { color: colors.text, fontFamily: fonts.title }]}>
              Why Upgrade?
            </Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefit}>
                <Infinity color={colors.accent} size={24} />
                <View style={styles.benefitText}>
                  <Text style={[styles.benefitTitle, { color: colors.text, fontFamily: fonts.body }]}>
                    Unlimited Wisdom
                  </Text>
                  <Text style={[styles.benefitDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                    No limits on daily oracle consultations
                  </Text>
                </View>
              </View>
              <View style={styles.benefit}>
                <Crown color={colors.accent} size={24} />
                <View style={styles.benefitText}>
                  <Text style={[styles.benefitTitle, { color: colors.text, fontFamily: fonts.body }]}>
                    Exclusive Content
                  </Text>
                  <Text style={[styles.benefitDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                    Access premium personas and interpretations
                  </Text>
                </View>
              </View>
              <View style={styles.benefit}>
                <Sparkles color={colors.accent} size={24} />
                <View style={styles.benefitText}>
                  <Text style={[styles.benefitTitle, { color: colors.text, fontFamily: fonts.body }]}>
                    Advanced Features
                  </Text>
                  <Text style={[styles.benefitDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                    Voice chat, cosmic calendar, and more
                  </Text>
                </View>
              </View>
            </View>
          </MysticalCard>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              All subscriptions include a 7-day free trial
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Cancel anytime • Secure payments • No hidden fees
            </Text>
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
  title: {
    fontSize: 28,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  statusCard: {
    marginBottom: 32,
  },
  statusContent: {
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  statusPlan: {
    fontSize: 24,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 32,
  },
  plansScroll: {
    paddingHorizontal: 10,
  },
  planCard: {
    width: width * 0.75,
    marginHorizontal: 10,
    position: 'relative',
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  currentPlan: {
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    right: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  planName: {
    fontSize: 20,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  planFeatures: {
    marginBottom: 24,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planFeatureText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  moreFeatures: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  planButton: {
    alignSelf: 'center',
    minWidth: '80%',
  },
  comparisonCard: {
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  comparisonHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 12,
    marginBottom: 16,
  },
  featureColumn: {
    flex: 2,
  },
  planColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureName: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  benefitsCard: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 20,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitText: {
    marginLeft: 16,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});