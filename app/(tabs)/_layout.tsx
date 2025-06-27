import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { HomeTabIcon, HistoryTabIcon, SettingsTabIcon } from '@/components/icons/TabIcons';

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
          height: 90,
          paddingBottom: 25,
          paddingTop: 15,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 8,
          fontFamily: 'PlayfairDisplay_400Regular',
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Oracle',
          tabBarIcon: ({ focused }) => (
            <HomeTabIcon 
              focused={focused}
              size={32}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <HistoryTabIcon 
              focused={focused}
              size={32}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <SettingsTabIcon 
              focused={focused}
              size={32}
            />
          ),
        }}
      />
    </Tabs>
  );
}