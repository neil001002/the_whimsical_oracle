import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Image } from 'react-native';

// Import PNG icons
import HomePng from '../../assets/icons/Home_icon.png';
import HistoryPng from '../../assets/icons/History_icon.png';
import SettingsPng from '../../assets/icons/Settings_icon.png';
import PremiumPng from '../../assets/icons/Premium_icon.png';
import ProfilePng from '../../assets/icons/Profile_icon.png';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.glassStrong,
          borderTopWidth: 1,
          height: 75,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={HomePng}
              style={{
                width: 36,
                height: 36,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={HistoryPng}
              style={{
                width: 36,
                height: 36,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: 'Premium',
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={PremiumPng}
              style={{
                width: 36,
                height: 36,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={ProfilePng}
              style={{
                width: 36,
                height: 36,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Image
              source={SettingsPng}
              style={{
                width: 36,
                height: 36,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}