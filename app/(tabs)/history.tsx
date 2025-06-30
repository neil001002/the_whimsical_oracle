import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { StarField } from '@/components/ui/StarField';
import { WhimsicalOmen } from '@/types';

export default function HistoryScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { t } = useLanguage();
  const { omenHistory, rateOmen } = useOracle();
  const [selectedOmen, setSelectedOmen] = useState<WhimsicalOmen | null>(null);

  const renderOmenItem = ({ item }: { item: WhimsicalOmen }) => (
    <TouchableOpacity
      onPress={() => setSelectedOmen(selectedOmen?.id === item.id ? null : item)}
      style={styles.omenItem}
    >
      <MysticalCard>
        <View style={styles.omenHeader}>
          <View style={styles.omenHeaderLeft}>
            <Text style={[styles.omenSymbol, { fontSize: 24 }]}>
              {item.symbol}
            </Text>
            <View style={styles.omenHeaderText}>
              <Text 
                style={[styles.omenPhrase, { color: colors.text, fontFamily: fonts.body }]}
                numberOfLines={1}
              >
                {item.crypticPhrase}
              </Text>
              <Text style={[styles.omenDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {new Date(item.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.omenRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => rateOmen(item.id, star)}
                style={styles.starButton}
              >
                <Star
                  size={16}
                  color={item.rating && star <= item.rating ? colors.accent : colors.textSecondary}
                  fill={item.rating && star <= item.rating ? colors.accent : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {selectedOmen?.id === item.id && (
          <View style={styles.expandedContent}>
            <Text style={[styles.interpretation, { color: colors.text, fontFamily: fonts.body }]}>
              {item.interpretation}
            </Text>
            <View style={styles.adviceContainer}>
              <Text style={[styles.adviceLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {t('home.omen.guidance', 'Guidance')}:
              </Text>
              <Text style={[styles.advice, { color: colors.text, fontFamily: fonts.body }]}>
                {item.advice}
              </Text>
            </View>
            <View style={styles.metadata}>
              <Text style={[styles.category, { color: colors.accent, fontFamily: fonts.body }]}>
                #{t(`categories.${item.category}`, item.category)}
              </Text>
              <Text style={[styles.confidence, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {Math.round(item.confidence * 100)}% {t('home.omen.resonance', 'resonance')}
              </Text>
            </View>
          </View>
        )}
      </MysticalCard>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptySymbol, { fontSize: 80 }]}>📜</Text>
      <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('history.empty.title', 'No Omens Yet')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
        {t('history.empty.subtitle', 'Visit the Oracle to receive your first mystical guidance')}
      </Text>
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
            {t('history.title', 'Omen Chronicle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('history.subtitle', 'Your mystical journey through time')}
          </Text>
        </View>

        {omenHistory.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={omenHistory}
            renderItem={renderOmenItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  omenItem: {
    marginBottom: 16,
  },
  omenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  omenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  omenSymbol: {
    marginRight: 12,
  },
  omenHeaderText: {
    flex: 1,
  },
  omenPhrase: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  omenDate: {
    fontSize: 12,
  },
  omenRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 2,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  interpretation: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  adviceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  adviceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  advice: {
    fontSize: 14,
    lineHeight: 18,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
  },
  confidence: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptySymbol: {
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 24,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});