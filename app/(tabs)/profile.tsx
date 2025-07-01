import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, CreditCard as Edit3, Calendar, Star, TrendingUp, Award, Clock, Heart, Save, X, LogOut } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { BoltBadge } from '@/components/ui/BoltBadge';

interface UserStats {
  totalReadings: number;
  favoritePersona: string;
  averageRating: number;
  streakDays: number;
  joinDate: Date;
  mostActiveCategory: string;
}

export default function ProfileScreen() {
  const { colors, fonts, spacing } = useTheme();
  const { t } = useLanguage();
  const { selectedPersona, omenHistory, userPreferences } = useOracle();
  const { session, userProfile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(userProfile?.username || t('profile.defaultName', 'Mystical Seeker'));
  const [userBio, setUserBio] = useState(userProfile?.bio || t('profile.defaultBio', 'On a journey to discover the mysteries of the universe'));

  // Calculate user statistics
  const calculateStats = (): UserStats => {
    const totalReadings = omenHistory.length;
    const ratedOmens = omenHistory.filter(omen => omen.rating);
    const averageRating = ratedOmens.length > 0 
      ? ratedOmens.reduce((sum, omen) => sum + (omen.rating || 0), 0) / ratedOmens.length
      : 0;

    // Find most used persona
    const personaCount = omenHistory.reduce((acc, omen) => {
      acc[omen.persona] = (acc[omen.persona] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoritePersona = Object.keys(personaCount).reduce((a, b) => 
      personaCount[a] > personaCount[b] ? a : b, selectedPersona.id);

    // Find most active category
    const categoryCount = omenHistory.reduce((acc, omen) => {
      acc[omen.category] = (acc[omen.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'growth');

    // Calculate streak (simplified - consecutive days with readings)
    const streakDays = Math.min(totalReadings, 7); // Simplified calculation

    return {
      totalReadings,
      favoritePersona,
      averageRating,
      streakDays,
      joinDate: userProfile?.stats?.joinDate ? new Date(userProfile.stats.joinDate) : new Date(),
      mostActiveCategory,
    };
  };

  const stats = calculateStats();

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: userName,
        bio: userBio,
      });
      setIsEditing(false);
      Alert.alert(t('profile.updateSuccess.title', 'Profile Updated'), t('profile.updateSuccess.message', 'Your mystical profile has been updated successfully!'));
    } catch (error) {
      Alert.alert(t('common.error', 'Error'), t('profile.updateError', 'Failed to update profile. Please try again.'));
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      t('profile.signOut.title', 'Sign Out'),
      t('profile.signOut.message', 'Are you sure you want to leave the mystical realm?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('profile.signOut.confirm', 'Sign Out'), 
          style: 'destructive',
          onPress: () => signOut()
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <MysticalCard glowColor={selectedPersona.colorScheme.accent} style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={[styles.avatar, { fontSize: 60 }]}>
            {selectedPersona.avatar}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.statusText, { color: colors.background, fontFamily: fonts.body }]}>
              {userPreferences.subscriptionTier.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.nameInput, { color: colors.text, fontFamily: fonts.title }]}
                value={userName}
                onChangeText={setUserName}
                placeholder={t('profile.placeholders.name', 'Your mystical name')}
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={[styles.bioInput, { color: colors.text, fontFamily: fonts.body }]}
                value={userBio}
                onChangeText={setUserBio}
                placeholder={t('profile.placeholders.bio', 'Your mystical journey...')}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  style={[styles.editButton, { borderColor: colors.textSecondary }]}
                >
                  <X color={colors.textSecondary} size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={[styles.editButton, { borderColor: colors.accent }]}
                >
                  <Save color={colors.accent} size={16} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.displayContainer}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: colors.text, fontFamily: fonts.title }]}>
                  {userName}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={[styles.editIcon, { borderColor: colors.accent }]}
                >
                  <Edit3 color={colors.accent} size={16} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.userBio, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {userBio}
              </Text>
              <Text style={[styles.userEmail, { color: colors.textTertiary, fontFamily: fonts.body }]}>
                {session.user?.email}
              </Text>
              <Text style={[styles.joinDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {t('profile.joinedOn', 'Mystical journey began {{date}}', { date: stats.joinDate.toLocaleDateString() })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </MysticalCard>
  );

  const renderStatsGrid = () => (
    <View style={styles.statsGrid}>
      <MysticalCard style={styles.statCard}>
        <TrendingUp color={colors.accent} size={24} />
        <Text style={[styles.statNumber, { color: colors.text, fontFamily: fonts.title }]}>
          {stats.totalReadings}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {t('profile.stats.totalReadings', 'Total Readings')}
        </Text>
      </MysticalCard>

      <MysticalCard style={styles.statCard}>
        <Star color={colors.accent} size={24} />
        <Text style={[styles.statNumber, { color: colors.text, fontFamily: fonts.title }]}>
          {stats.averageRating.toFixed(1)}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {t('profile.stats.averageRating', 'Avg Rating')}
        </Text>
      </MysticalCard>

      <MysticalCard style={styles.statCard}>
        <Clock color={colors.accent} size={24} />
        <Text style={[styles.statNumber, { color: colors.text, fontFamily: fonts.title }]}>
          {stats.streakDays}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {t('profile.stats.dayStreak', 'Day Streak')}
        </Text>
      </MysticalCard>

      <MysticalCard style={styles.statCard}>
        <Heart color={colors.accent} size={24} />
        <Text style={[styles.statNumber, { color: colors.text, fontFamily: fonts.title }]}>
          {t(`categories.${stats.mostActiveCategory}`, stats.mostActiveCategory)}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          {t('profile.stats.favoriteCategory', 'Favorite Topic')}
        </Text>
      </MysticalCard>
    </View>
  );

  const renderAchievements = () => (
    <MysticalCard style={styles.achievementsCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('profile.achievements.title', 'Mystical Achievements')}
      </Text>
      
      <View style={styles.achievementsList}>
        <View style={styles.achievement}>
          <Award color={colors.accent} size={20} />
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('profile.achievements.firstSteps', 'First Steps')}
            </Text>
            <Text style={[styles.achievementDesc, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('profile.achievements.firstStepsDesc', 'Received your first oracle reading')}
            </Text>
          </View>
          <Text style={[styles.achievementDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            ✓
          </Text>
        </View>

        {stats.totalReadings >= 5 && (
          <View style={styles.achievement}>
            <Award color={colors.accent} size={20} />
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.text, fontFamily: fonts.body }]}>
                {t('profile.achievements.seeker', 'Seeker')}
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {t('profile.achievements.seekerDesc', 'Completed 5 oracle consultations')}
              </Text>
            </View>
            <Text style={[styles.achievementDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              ✓
            </Text>
          </View>
        )}

        {stats.totalReadings >= 10 && (
          <View style={styles.achievement}>
            <Award color={colors.accent} size={20} />
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.text, fontFamily: fonts.body }]}>
                {t('profile.achievements.explorer', 'Mystic Explorer')}
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {t('profile.achievements.explorerDesc', 'Reached 10 oracle readings')}
              </Text>
            </View>
            <Text style={[styles.achievementDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              ✓
            </Text>
          </View>
        )}

        {stats.averageRating >= 4 && (
          <View style={styles.achievement}>
            <Award color={colors.accent} size={20} />
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.text, fontFamily: fonts.body }]}>
                {t('profile.achievements.appreciator', 'Wisdom Appreciator')}
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                {t('profile.achievements.appreciatorDesc', 'Maintained high rating average')}
              </Text>
            </View>
            <Text style={[styles.achievementDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              ✓
            </Text>
          </View>
        )}
      </View>
    </MysticalCard>
  );

  const renderRecentActivity = () => (
    <MysticalCard style={styles.activityCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        {t('profile.recentActivity.title', 'Recent Mystical Activity')}
      </Text>
      
      {omenHistory.slice(0, 3).map((omen, index) => (
        <View key={omen.id} style={styles.activityItem}>
          <Text style={[styles.activitySymbol, { fontSize: 24 }]}>
            {omen.symbol}
          </Text>
          <View style={styles.activityInfo}>
            <Text style={[styles.activityPhrase, { color: colors.text, fontFamily: fonts.body }]}>
              {omen.crypticPhrase}
            </Text>
            <Text style={[styles.activityDate, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {omen.timestamp.toLocaleDateString()} • {t(`categories.${omen.category}`, omen.category)}
            </Text>
          </View>
          {omen.rating && (
            <View style={styles.activityRating}>
              <Star color={colors.accent} size={16} fill={colors.accent} />
              <Text style={[styles.ratingText, { color: colors.accent, fontFamily: fonts.body }]}>
                {omen.rating}
              </Text>
            </View>
          )}
        </View>
      ))}

      {omenHistory.length === 0 && (
        <View style={styles.emptyActivity}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
            {t('profile.recentActivity.empty', 'No mystical activity yet. Visit the Oracle to begin your journey!')}
          </Text>
        </View>
      )}
    </MysticalCard>
  );

  const renderBoltBadge = () => (
    <View style={styles.badgeContainer}>
      <BoltBadge variant="cosmic" size="small" />
    </View>
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
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
              {t('profile.title', 'Mystical Profile')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {t('profile.subtitle', 'Your journey through the cosmic realm')}
            </Text>
          </View>

          {renderProfileHeader()}
          {renderStatsGrid()}
          {renderAchievements()}
          {renderRecentActivity()}

          {/* Sign Out Button */}
          <MagicalButton
            title={t('profile.signOut.button', 'Leave the Mystical Realm')}
            onPress={handleSignOut}
            variant="secondary"
            style={styles.signOutButton}
          />

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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  profileInfo: {
    width: '100%',
    alignItems: 'center',
  },
  editContainer: {
    width: '100%',
  },
  nameInput: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
  },
  bioInput: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  displayContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    marginRight: 12,
  },
  editIcon: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 15,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.8,
  },
  userEmail: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.6,
  },
  joinDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  achievementsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementsList: {
    gap: 16,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    opacity: 0.8,
  },
  achievementDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityCard: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activitySymbol: {
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityPhrase: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  signOutButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});