import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
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
  X,
  RefreshCw,
  TestTube
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BoltBadge } from '@/components/ui/BoltBadge';

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
  const { colors, fonts } = useTheme();
  const { t } = useLanguage();
  const { 
    subscriptionStatus, 
    availablePackages, 
    subscriptionTiers,
    isLoading,
    error,
    canAccessPremiumFeatures,
    isRevenueCatAvailable,
    purchaseSubscription,
    restorePurchases,
    refreshSubscriptionStatus
  } = useSubscription();
  
  const [purchasingPackageId, setPurchasingPackageId] = useState<string | null>(null);

  const features: PremiumFeature[] = [
    {
      icon: <Zap color={colors.accent} size={24} />,
      title: t('premium.features.dailyReadings', 'Daily Oracle Readings'),
      description: t('premium.features.dailyReadingsDesc', 'Receive mystical guidance every day'),
      free: true,
      premium: true,
      mystic: true,
    },
    {
      icon: <Star color={colors.accent} size={24} />,
      title: t('premium.features.personas', 'Multiple Oracle Personas'),
      description: t('premium.features.personasDesc', 'Choose from 5 unique mystical guides'),
      free: true,
      premium: true,
      mystic: true,
    },
    {
      icon: <Sparkles color={colors.accent} size={24} />,
      title: t('premium.features.voice', 'Voice Narration'),
      description: t('premium.features.voiceDesc', 'Hear your omens spoken aloud'),
      free: true,
      premium: true,
      mystic: true,
    },
    {
      icon: <Infinity color={colors.accent} size={24} />,
      title: t('premium.features.unlimited', 'Unlimited Readings'),
      description: t('premium.features.unlimitedDesc', 'No daily limits on oracle consultations'),
      free: false,
      premium: true,
      mystic: true,
    },
    {
      icon: <Crown color={colors.accent} size={24} />,
      title: t('premium.features.premiumPersonas', 'Premium Personas'),
      description: t('premium.features.premiumPersonasDesc', 'Access to exclusive mystical guides'),
      free: false,
      premium: true,
      mystic: true,
    },
    {
      icon: <Shield color={colors.accent} size={24} />,
      title: t('premium.features.advanced', 'Advanced Interpretations'),
      description: t('premium.features.advancedDesc', 'Deeper insights and detailed guidance'),
      free: false,
      premium: true,
      mystic: true,
    },
    {
      icon: <Sparkles color={colors.accent} size={24} />,
      title: t('premium.features.videoOracle', 'Video Oracle Sessions'),
      description: t('premium.features.videoOracleDesc', 'Face-to-face mystical conversations'),
      free: false,
      premium: false,
      mystic: true,
    },
    {
      icon: <Star color={colors.accent} size={24} />,
      title: t('premium.features.cosmicCalendar', 'Cosmic Calendar'),
      description: t('premium.features.cosmicCalendarDesc', 'Astrological timing for readings'),
      free: false,
      premium: false,
      mystic: true,
    },
  ];

  const handlePurchase = async (packageId: string) => {
    const packageToPurchase = availablePackages.find(pkg => pkg.identifier === packageId);
    
    if (!packageToPurchase) {
      Alert.alert(t('common.error', 'Error'), t('premium.errors.packageNotFound', 'Package not found'));
      return;
    }

    setPurchasingPackageId(packageId);
    
    try {
      const success = await purchaseSubscription(packageToPurchase);
      
      if (success) {
        Alert.alert(
          t('premium.success.title', 'Purchase Successful! 🎉'),
          t('premium.success.message', 'Welcome to your enhanced mystical journey! Your premium features are now active.'),
          [{ text: t('common.continue', 'Continue'), style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('premium.errors.purchaseFailed', 'Purchase Failed'),
        t('premium.errors.purchaseFailedMessage', 'Unable to complete your purchase. Please try again.'),
        [{ text: t('common.ok', 'OK'), style: 'default' }]
      );
    } finally {
      setPurchasingPackageId(null);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert(
        t('premium.restore.title', 'Restore Complete'),
        t('premium.restore.message', 'Your purchases have been restored successfully!'),
        [{ text: t('common.ok', 'OK'), style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        t('premium.errors.restoreFailed', 'Restore Failed'),
        t('premium.errors.restoreFailedMessage', 'Unable to restore purchases. Please try again.'),
        [{ text: t('common.ok', 'OK'), style: 'default' }]
      );
    }
  };

  // Test subscription simulation (development only)
  const handleTestSubscription = async (tier: 'premium' | 'mystic') => {
    if (!isRevenueCatAvailable) {
      // Find the corresponding package
      const packageToPurchase = availablePackages.find(pkg => 
        pkg.identifier.includes(tier)
      );
      
      if (packageToPurchase) {
        await handlePurchase(packageToPurchase.identifier);
      }
    }
  };

  const renderFeatureComparison = () => (
    <MysticalCard style={styles.comparisonCard}>
      <Text style={[styles.comparisonTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('premium.comparison.title', 'Feature Comparison')}
      </Text>
      
      <View style={styles.comparisonHeader}>
        <View style={styles.featureColumn}>
          <Text style={[styles.columnHeader, { color: colors.text, fontFamily: fonts.body }]}>
            {t('premium.comparison.feature', 'Feature')}
          </Text>
        </View>
        <View style={styles.planColumn}>
          <Text style={[styles.columnHeader, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('premium.comparison.free', 'Free')}
          </Text>
        </View>
        <View style={styles.planColumn}>
          <Text style={[styles.columnHeader, { color: colors.accent, fontFamily: fonts.body }]}>
            {t('premium.comparison.premium', 'Premium')}
          </Text>
        </View>
        <View style={styles.planColumn}>
          <Text style={[styles.columnHeader, { color: colors.accent, fontFamily: fonts.body }]}>
            {t('premium.comparison.mystic', 'Mystic')}
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

  const renderSubscriptionCard = (tier: any) => {
    const isCurrentTier = subscriptionStatus.tier === tier.id;
    const availablePackage = availablePackages.find(pkg => pkg.identifier === tier.productId);
    const isPurchasing = purchasingPackageId === tier.productId;
    
    return (
      <MysticalCard 
        key={tier.id}
        glowColor={tier.popular ? colors.accent : undefined}
        style={[
          styles.subscriptionCard,
          tier.popular && styles.popularCard,
          isCurrentTier && styles.currentCard,
        ]}
      >
        {tier.popular && (
          <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.popularText, { color: colors.background, fontFamily: fonts.body }]}>
              {t('premium.mostPopular', 'Most Popular')}
            </Text>
          </View>
        )}
        
        <View style={styles.cardHeader}>
          <Text style={[styles.tierName, { color: colors.text, fontFamily: fonts.title }]}>
            {t(`premium.tiers.${tier.id}.name`, tier.name)}
          </Text>
          <Text style={[styles.tierPrice, { color: colors.accent, fontFamily: fonts.title }]}>
            {availablePackage ? availablePackage.product.priceString : t(`premium.tiers.${tier.id}.price`, tier.price)}
          </Text>
          <Text style={[styles.tierDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t(`premium.tiers.${tier.id}.description`, tier.description)}
          </Text>
        </View>

        <View style={styles.featuresList}>
          {tier.features.slice(0, 4).map((feature: string, index: number) => (
            <View key={index} style={styles.featureItem}>
              <Check color={colors.success} size={16} />
              <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
                {t(`premium.features.${feature}`, feature)}
              </Text>
            </View>
          ))}
          {tier.features.length > 4 && (
            <Text style={[styles.moreFeatures, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('premium.moreFeatures', '+{{count}} more features', { count: tier.features.length - 4 })}
            </Text>
          )}
        </View>

        {tier.id === 'free' ? (
          <MagicalButton
            title={isCurrentTier ? t('premium.currentPlan', 'Current Plan') : t('premium.freeForever', 'Free Forever')}
            onPress={() => {}}
            disabled={true}
            variant="secondary"
            style={styles.subscriptionButton}
          />
        ) : (
          <MagicalButton
            title={
              isPurchasing ? t('premium.processing', 'Processing...') : 
              isCurrentTier ? t('premium.currentPlan', 'Current Plan') : 
              t('premium.upgradeTo', 'Upgrade to {{tier}}', { tier: tier.name })
            }
            onPress={() => handlePurchase(tier.productId)}
            disabled={isPurchasing || isCurrentTier || (!availablePackage && isRevenueCatAvailable)}
            variant={tier.popular ? 'golden' : 'primary'}
            style={styles.subscriptionButton}
          />
        )}
      </MysticalCard>
    );
  };

  const renderBoltBadge = () => (
    <View style={styles.badgeContainer}>
      <BoltBadge variant="cosmic" size="small" />
    </View>
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.container}
      >
        <StarField />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner color={colors.accent} size={60} />
            <Text style={[styles.loadingText, { color: colors.text, fontFamily: fonts.body }]}>
              {t('premium.loading', 'Loading mystical offerings...')}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
              {t('premium.title', 'Unlock Mystical Powers')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('premium.subtitle', 'Choose your path to deeper wisdom')}
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <MysticalCard style={styles.errorCard}>
              <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.body }]}>
                {error}
              </Text>
              <MagicalButton
                title={t('common.retry', 'Retry')}
                onPress={refreshSubscriptionStatus}
                variant="secondary"
                size="small"
                style={styles.retryButton}
              />
            </MysticalCard>
          )}

          {/* Service Status */}
          {!isRevenueCatAvailable && (
            <MysticalCard style={styles.statusCard}>
              <Text style={[styles.statusTitle, { color: colors.warning, fontFamily: fonts.title }]}>
                {t('premium.developmentMode', 'Development Mode')}
              </Text>
              <Text style={[styles.statusText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {t('premium.developmentModeDesc', 'RevenueCat is not available in this environment. Subscription features are simulated for development purposes.')}
              </Text>
              
              {/* Test Subscription Buttons for Development */}
              <View style={styles.testButtons}>
                <MagicalButton
                  title="Test Premium"
                  onPress={() => handleTestSubscription('premium')}
                  variant="secondary"
                  size="small"
                  style={styles.testButton}
                />
                <MagicalButton
                  title="Test Mystic"
                  onPress={() => handleTestSubscription('mystic')}
                  variant="secondary"
                  size="small"
                  style={styles.testButton}
                />
              </View>
            </MysticalCard>
          )}

          {/* Current Subscription Status */}
          <MysticalCard style={styles.statusCard}>
            <View style={styles.statusContent}>
              <Text style={[styles.statusTitle, { color: colors.text, fontFamily: fonts.title }]}>
                {t('premium.currentPlan', 'Current Plan')}
              </Text>
              <Text style={[styles.statusPlan, { color: colors.accent, fontFamily: fonts.title }]}>
                {subscriptionStatus.tier.toUpperCase()} {t('premium.tier', 'TIER')}
              </Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {subscriptionStatus.tier === 'free' 
                  ? t('premium.descriptions.free', 'Access to basic oracle features')
                  : subscriptionStatus.tier === 'premium'
                    ? t('premium.descriptions.premium', 'Enhanced mystical capabilities')
                    : t('premium.descriptions.mystic', 'Complete oracle mastery')
                }
              </Text>
              {subscriptionStatus.expirationDate && (
                <Text style={[styles.expirationText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  {subscriptionStatus.willRenew ? t('premium.renews', 'Renews') : t('premium.expires', 'Expires')} {t('premium.on', 'on')}{' '}
                  {subscriptionStatus.expirationDate.toLocaleDateString()}
                </Text>
              )}
            </View>
          </MysticalCard>

          {/* Subscription Tiers */}
          <View style={styles.tiersContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
              {t('premium.choosePath', 'Choose Your Mystical Path')}
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tiersScroll}
            >
              {subscriptionTiers.map(renderSubscriptionCard)}
            </ScrollView>
          </View>

          {/* Feature Comparison */}
          {renderFeatureComparison()}

          {/* Restore Purchases */}
          <View style={styles.restoreContainer}>
            <MagicalButton
              title={t('premium.restorePurchases', 'Restore Purchases')}
              onPress={handleRestorePurchases}
              variant="secondary"
              size="medium"
              style={styles.restoreButton}
            />
            <Text style={[styles.restoreText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('premium.restoreText', 'Already purchased? Restore your mystical powers')}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('premium.footer.trial', 'All subscriptions include a 7-day free trial')}
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('premium.footer.terms', 'Cancel anytime • Secure payments • No hidden fees')}
            </Text>
          </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
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
  errorCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'center',
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
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  expirationText: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
  },
  testButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    justifyContent: 'center',
  },
  testButton: {
    minWidth: 100,
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  tiersContainer: {
    marginBottom: 32,
  },
  tiersScroll: {
    paddingHorizontal: 10,
  },
  subscriptionCard: {
    width: width * 0.75,
    marginHorizontal: 10,
    position: 'relative',
  },
  popularCard: {
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  currentCard: {
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
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  tierName: {
    fontSize: 20,
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 28,
    marginBottom: 8,
  },
  tierDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
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
  subscriptionButton: {
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
  restoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  restoreButton: {
    marginBottom: 12,
  },
  restoreText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
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
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});