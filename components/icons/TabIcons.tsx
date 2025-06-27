import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface TabIconProps {
  focused: boolean;
  size?: number;
}

// SVG content for each icon (extracted from your provided SVG files)
const homeIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="homeGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#2D1B69" />
    </radialGradient>
  </defs>
  <circle cx="12" cy="12" r="10" fill="url(#homeGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" />
  <circle cx="12" cy="8" r="2" fill="COLOR_PLACEHOLDER" opacity="0.8" />
  <path d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4v6H8v-6z" fill="COLOR_PLACEHOLDER" opacity="0.6"/>
  <circle cx="12" cy="12" r="1" fill="COLOR_PLACEHOLDER" />
  <path d="M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" stroke="COLOR_PLACEHOLDER" stroke-width="1" opacity="0.4"/>
</svg>
`;

const historyIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#2D1B69" />
    </linearGradient>
  </defs>
  <path d="M4 6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6z" fill="url(#scrollGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="1.5"/>
  <path d="M4 6c0-1.1.9-2 2-2h1v16H6c-1.1 0-2-.9-2-2V6z" fill="COLOR_PLACEHOLDER" opacity="0.3"/>
  <path d="M17 6c0-1.1.9-2 2-2h1v16h-1c-1.1 0-2-.9-2-2V6z" fill="COLOR_PLACEHOLDER" opacity="0.3"/>
  <path d="M9 8h6M9 11h6M9 14h4" stroke="COLOR_PLACEHOLDER" stroke-width="1" opacity="0.7"/>
  <circle cx="12" cy="6" r="1" fill="COLOR_PLACEHOLDER"/>
  <circle cx="12" cy="18" r="1" fill="COLOR_PLACEHOLDER"/>
</svg>
`;

const settingsIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#2D1B69" />
    </radialGradient>
  </defs>
  <path d="M12 2l2.4 2.4 3.4-.7.7 3.4L21 9.6v4.8l-2.5 2.5-.7 3.4-3.4-.7L12 22l-2.4-2.4-3.4.7-.7-3.4L3 14.4V9.6l2.5-2.5.7-3.4 3.4.7L12 2z" fill="url(#gearGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="4" fill="none" stroke="COLOR_PLACEHOLDER" stroke-width="1.5"/>
  <circle cx="12" cy="12" r="2" fill="COLOR_PLACEHOLDER" opacity="0.8"/>
  <path d="M12 8v1M12 15v1M8 12h1M15 12h1" stroke="COLOR_PLACEHOLDER" stroke-width="1" opacity="0.6"/>
  <circle cx="12" cy="6" r="0.5" fill="COLOR_PLACEHOLDER" opacity="0.4"/>
  <circle cx="12" cy="18" r="0.5" fill="COLOR_PLACEHOLDER" opacity="0.4"/>
  <circle cx="6" cy="12" r="0.5" fill="COLOR_PLACEHOLDER" opacity="0.4"/>
  <circle cx="18" cy="12" r="0.5" fill="COLOR_PLACEHOLDER" opacity="0.4"/>
</svg>
`;

export const HomeTabIcon = ({ focused, size = 28 }: TabIconProps) => {
  const color = focused ? '#F59E0B' : '#CBD5E1';
  const svgContent = homeIconSvg.replace(/COLOR_PLACEHOLDER/g, color);
  
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <SvgXml 
        xml={svgContent} 
        width={size} 
        height={size}
      />
    </View>
  );
};

export const HistoryTabIcon = ({ focused, size = 28 }: TabIconProps) => {
  const color = focused ? '#F59E0B' : '#CBD5E1';
  const svgContent = historyIconSvg.replace(/COLOR_PLACEHOLDER/g, color);
  
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <SvgXml 
        xml={svgContent} 
        width={size} 
        height={size}
      />
    </View>
  );
};

export const SettingsTabIcon = ({ focused, size = 28 }: TabIconProps) => {
  const color = focused ? '#F59E0B' : '#CBD5E1';
  const svgContent = settingsIconSvg.replace(/COLOR_PLACEHOLDER/g, color);
  
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <SvgXml 
        xml={svgContent} 
        width={size} 
        height={size}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});