import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Platform } from 'react-native';

interface TabIconProps {
  focused: boolean;
  size?: number;
  color?: string;
}

// SVG content for each icon (extracted from your assets)
const homeSvg = `
<svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="orbGradient" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#2D1B69;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="innerGlow" cx="50%" cy="40%" r="30%">
      <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Outer glow -->
  <circle cx="50" cy="50" r="45" fill="url(#orbGradient)" opacity="0.3"/>
  
  <!-- Main orb -->
  <circle cx="50" cy="50" r="35" fill="url(#orbGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="2"/>
  
  <!-- Inner mystical glow -->
  <circle cx="50" cy="45" r="20" fill="url(#innerGlow)"/>
  
  <!-- Mystical sparkles -->
  <circle cx="35" cy="35" r="2" fill="COLOR_PLACEHOLDER" opacity="0.8"/>
  <circle cx="65" cy="35" r="1.5" fill="COLOR_PLACEHOLDER" opacity="0.6"/>
  <circle cx="30" cy="65" r="1" fill="COLOR_PLACEHOLDER" opacity="0.7"/>
  <circle cx="70" cy="65" r="2" fill="COLOR_PLACEHOLDER" opacity="0.8"/>
  
  <!-- Central mystical symbol -->
  <path d="M45 45 L50 40 L55 45 L50 50 Z" fill="COLOR_PLACEHOLDER" opacity="0.9"/>
  <circle cx="50" cy="45" r="3" fill="COLOR_PLACEHOLDER" opacity="0.7"/>
</svg>
`;

const historySvg = `
<svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#5B21B6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2D1B69;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FEF3C7;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:0.7" />
    </linearGradient>
  </defs>
  
  <!-- Scroll base -->
  <rect x="15" y="20" width="70" height="60" rx="8" fill="url(#scrollGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="2"/>
  
  <!-- Paper/parchment -->
  <rect x="20" y="25" width="60" height="50" rx="4" fill="url(#paperGradient)" opacity="0.8"/>
  
  <!-- Scroll ends -->
  <circle cx="15" cy="50" r="8" fill="url(#scrollGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="1.5"/>
  <circle cx="85" cy="50" r="8" fill="url(#scrollGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="1.5"/>
  
  <!-- Text lines -->
  <line x1="28" y1="35" x2="65" y2="35" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  <line x1="28" y1="45" x2="72" y2="45" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  <line x1="28" y1="55" x2="58" y2="55" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  <line x1="28" y1="65" x2="68" y2="65" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  
  <!-- Mystical symbols -->
  <circle cx="15" cy="50" r="3" fill="COLOR_PLACEHOLDER" opacity="0.8"/>
  <circle cx="85" cy="50" r="3" fill="COLOR_PLACEHOLDER" opacity="0.8"/>
  
  <!-- Decorative elements -->
  <path d="M25 30 L30 25 L35 30" stroke="COLOR_PLACEHOLDER" stroke-width="1" fill="none" opacity="0.6"/>
  <circle cx="75" cy="30" r="1.5" fill="COLOR_PLACEHOLDER" opacity="0.6"/>
</svg>
`;

const settingsSvg = `
<svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2D1B69;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="40%">
      <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Outer gear teeth -->
  <path d="M50 10 L55 15 L60 10 L65 15 L70 10 L75 20 L85 15 L90 25 L85 35 L90 45 L85 55 L90 65 L85 75 L75 80 L70 90 L65 85 L60 90 L55 85 L50 90 L45 85 L40 90 L35 85 L30 90 L25 80 L15 85 L10 75 L15 65 L10 55 L15 45 L10 35 L15 25 L10 15 L25 20 L30 10 L35 15 L40 10 L45 15 Z" 
        fill="url(#gearGradient)" 
        stroke="COLOR_PLACEHOLDER" 
        stroke-width="2"/>
  
  <!-- Inner gear circle -->
  <circle cx="50" cy="50" r="25" fill="url(#gearGradient)" stroke="COLOR_PLACEHOLDER" stroke-width="2"/>
  
  <!-- Center glow -->
  <circle cx="50" cy="50" r="15" fill="url(#centerGlow)"/>
  
  <!-- Central mystical symbol -->
  <circle cx="50" cy="50" r="8" fill="none" stroke="COLOR_PLACEHOLDER" stroke-width="2"/>
  <circle cx="50" cy="50" r="4" fill="COLOR_PLACEHOLDER" opacity="0.8"/>
  
  <!-- Mystical cross pattern -->
  <line x1="50" y1="42" x2="50" y2="46" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  <line x1="50" y1="54" x2="50" y2="58" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  <line x1="42" y1="50" x2="46" y2="50" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  <line x1="54" y1="50" x2="58" y2="50" stroke="COLOR_PLACEHOLDER" stroke-width="1.5" opacity="0.7"/>
  
  <!-- Decorative sparkles -->
  <circle cx="30" cy="30" r="1.5" fill="COLOR_PLACEHOLDER" opacity="0.6"/>
  <circle cx="70" cy="30" r="1" fill="COLOR_PLACEHOLDER" opacity="0.5"/>
  <circle cx="30" cy="70" r="1" fill="COLOR_PLACEHOLDER" opacity="0.5"/>
  <circle cx="70" cy="70" r="1.5" fill="COLOR_PLACEHOLDER" opacity="0.6"/>
</svg>
`;

export const HomeTabIcon = ({ focused, size = 24, color = '#F59E0B' }: TabIconProps) => {
  const iconColor = focused ? color : '#CBD5E1';
  const svgContent = homeSvg.replace(/COLOR_PLACEHOLDER/g, iconColor);
  
  return (
    <SvgXml 
      xml={svgContent} 
      width={size} 
      height={size}
    />
  );
};

export const HistoryTabIcon = ({ focused, size = 24, color = '#F59E0B' }: TabIconProps) => {
  const iconColor = focused ? color : '#CBD5E1';
  const svgContent = historySvg.replace(/COLOR_PLACEHOLDER/g, iconColor);
  
  return (
    <SvgXml 
      xml={svgContent} 
      width={size} 
      height={size}
    />
  );
};

export const SettingsTabIcon = ({ focused, size = 24, color = '#F59E0B' }: TabIconProps) => {
  const iconColor = focused ? color : '#CBD5E1';
  const svgContent = settingsSvg.replace(/COLOR_PLACEHOLDER/g, iconColor);
  
  return (
    <SvgXml 
      xml={svgContent} 
      width={size} 
      height={size}
    />
  );
};