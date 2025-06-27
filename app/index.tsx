import { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StarField } from '@/components/ui/StarField';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { colors, fonts } = useTheme();

  useEffect(() => {
    // Simulate loading time for the splash screen
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // After the splash screen, redirect to the main tabs
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 60,
    opacity: 0.8,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
  },
});