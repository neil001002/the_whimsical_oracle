import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { HomeIcon, HistoryIcon, SettingsIcon } from '@/components/icons/MysticalIcons';

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
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Oracle',
          tabBarIcon: ({ color, size, focused }) => (
            <HomeIcon 
              color={focused ? colors.accent : colors.textSecondary} 
              size={size} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <HistoryIcon 
              color={focused ? colors.accent : colors.textSecondary} 
              size={size} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <SettingsIcon 
              color={focused ? colors.accent : colors.textSecondary} 
              size={size} 
            />
          ),
        }}
      />
    </Tabs>
  );
}