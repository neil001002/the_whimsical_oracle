import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { StarField } from '@/components/ui/StarField';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const { session, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <LinearGradient
        colors={colors.gradients.cosmic}
        style={styles.container}
      >
        <StarField />
        <View style={styles.loadingContainer}>
          <LoadingSpinner color={colors.accent} size={60} />
        </View>
      </LinearGradient>
    );
  }

  // Redirect based on authentication state
  if (session.user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});