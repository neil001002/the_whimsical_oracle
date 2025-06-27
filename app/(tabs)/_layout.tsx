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
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          fontFamily: 'PlayfairDisplay_400Regular',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Oracle',
          tabBarIcon: ({ focused, size }) => (
            <HomeTabIcon 
              focused={focused}
              size={size} 
              color={colors.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused, size }) => (
            <HistoryTabIcon 
              focused={focused}
              size={size} 
              color={colors.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, size }) => (
            <SettingsTabIcon 
              focused={focused}
              size={size} 
              color={colors.accent}
            />
          ),
        }}
      />
    </Tabs>
  );
}