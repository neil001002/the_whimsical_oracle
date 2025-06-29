import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Crown, Sparkles, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MysticalCard } from '@/components/ui/MysticalCard';

interface SubscriptionBannerProps {
  onUpgrade: () => void;
  onDismiss?: () => void;
  message?: string;
  variant?: 'compact' | 'full';
}

export function SubscriptionBanner({ 
  onUpgrade, 
  onDismiss, 
  message = "Unlock unlimited mystical wisdom!",
  variant = 'compact'
}: SubscriptionBannerProps) {
  const { colors, fonts } = useTheme();

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onUpgrade} style={styles.compactContainer}>
        <MysticalCard 
          variant="golden" 
          glowColor={colors.accent}
          style={styles.compactCard}
        >
          <View style={styles.compactContent}>
            <Crown color={colors.accent} size={20} />
            <Text style={[styles.compactText, { color: colors.text, fontFamily: fonts.body }]}>
              {message}
            </Text>
            <Sparkles color={colors.accent} size={16} />
          </View>
        </MysticalCard>
      </TouchableOpacity>
    );
  }

  return (
    <MysticalCard 
      variant="golden" 
      glowColor={colors.accent}
      animated={true}
      style={styles.fullContainer}
    >
      <View style={styles.fullContent}>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <X color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        )}
        
        <View style={styles.iconContainer}>
          <Crown color={colors.accent} size={32} />
          <Sparkles color={colors.accent} size={24} style={styles.sparkle1} />
          <Sparkles color={colors.accentSecondary} size={20} style={styles.sparkle2} />
        </View>
        
        <Text style={[styles.fullTitle, { color: colors.text, fontFamily: fonts.title }]}>
          Unlock Premium Mystical Powers
        </Text>
        
        <Text style={[styles.fullMessage, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {message}
        </Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
              Unlimited oracle readings
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔮</Text>
            <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
              Enhanced mystical interpretations
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👑</Text>
            <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
              Exclusive premium personas
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={onUpgrade}
          style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.upgradeButtonText, { color: colors.background, fontFamily: fonts.body }]}>
            Upgrade Now
          </Text>
        </TouchableOpacity>
      </View>
    </MysticalCard>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    marginVertical: 8,
  },
  compactCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    textAlign: 'center',
    flex: 1,
  },
  fullContainer: {
    marginVertical: 16,
    position: 'relative',
  },
  fullContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -4,
    left: -12,
  },
  fullTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  fullMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});