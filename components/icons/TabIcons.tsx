import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

interface TabIconProps {
  focused: boolean;
  size?: number;
  color?: string;
}

export const HomeTabIcon = ({ focused, size = 28 }: TabIconProps) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <Image
        source={require('@/assets/icons/home.svg')}
        style={[
          styles.icon,
          { 
            width: size, 
            height: size,
            opacity: focused ? 1 : 0.6,
            tintColor: focused ? '#F59E0B' : '#CBD5E1'
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export const HistoryTabIcon = ({ focused, size = 28 }: TabIconProps) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <Image
        source={require('@/assets/icons/history.svg')}
        style={[
          styles.icon,
          { 
            width: size, 
            height: size,
            opacity: focused ? 1 : 0.6,
            tintColor: focused ? '#F59E0B' : '#CBD5E1'
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export const SettingsTabIcon = ({ focused, size = 28 }: TabIconProps) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <Image
        source={require('@/assets/icons/settings.svg')}
        style={[
          styles.icon,
          { 
            width: size, 
            height: size,
            opacity: focused ? 1 : 0.6,
            tintColor: focused ? '#F59E0B' : '#CBD5E1'
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    // Additional styling if needed
  },
});