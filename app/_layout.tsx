import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Cinzel_400Regular,
  Cinzel_600SemiBold,
} from '@expo-google-fonts/cinzel';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { OracleProvider } from '@/contexts/OracleContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { VideoOracleProvider } from '@/contexts/VideoOracleContext';

// Import i18n configuration
import '@/lib/i18n';

// Only register WebRTC globals on supported platforms and when available
if (Platform.OS !== 'web') {
  try {
    // Check if we're running in a custom development build (not Expo Go)
    const isCustomBuild = !__DEV__ || (typeof expo === 'undefined' || !expo?.modules?.ExpoGo);
    
    if (isCustomBuild) {
      const { registerGlobals } = require('@livekit/react-native-webrtc');
      registerGlobals();
      console.log('WebRTC globals registered successfully');
    } else {
      console.log('WebRTC not available in Expo Go - LiveKit features will be disabled');
    }
  } catch (error) {
    console.warn('Failed to register WebRTC globals:', error instanceof Error ? error.message : String(error));
    console.log('LiveKit voice features will be disabled. To enable them, create a custom development build.');
  }
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <OracleProvider>
              <VideoOracleProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" backgroundColor="#0F0F23" />
              </VideoOracleProvider>
            </OracleProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}