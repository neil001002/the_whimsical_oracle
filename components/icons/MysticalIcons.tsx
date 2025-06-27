import React from 'react';
import Svg, { Path, Circle, Ellipse, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const HomeIcon = ({ size = 24, color = '#F59E0B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <RadialGradient id="homeGradient" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#2D1B69" />
      </RadialGradient>
    </Defs>
    <Circle cx="12" cy="12" r="10" fill="url(#homeGradient)" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="8" r="2" fill={color} opacity="0.8" />
    <Path 
      d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4v6H8v-6z" 
      fill={color} 
      opacity="0.6"
    />
    <Circle cx="12" cy="12" r="1" fill={color} />
    <Path 
      d="M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.4"
    />
  </Svg>
);

export const HistoryIcon = ({ size = 24, color = '#F59E0B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#7C3AED" />
        <Stop offset="100%" stopColor="#2D1B69" />
      </LinearGradient>
    </Defs>
    <Path 
      d="M4 6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6z" 
      fill="url(#scrollGradient)" 
      stroke={color} 
      strokeWidth="1.5"
    />
    <Path 
      d="M4 6c0-1.1.9-2 2-2h1v16H6c-1.1 0-2-.9-2-2V6z" 
      fill={color} 
      opacity="0.3"
    />
    <Path 
      d="M17 6c0-1.1.9-2 2-2h1v16h-1c-1.1 0-2-.9-2-2V6z" 
      fill={color} 
      opacity="0.3"
    />
    <Path d="M9 8h6M9 11h6M9 14h4" stroke={color} strokeWidth="1" opacity="0.7" />
    <Circle cx="12" cy="6" r="1" fill={color} />
    <Circle cx="12" cy="18" r="1" fill={color} />
  </Svg>
);

export const SettingsIcon = ({ size = 24, color = '#F59E0B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <RadialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#2D1B69" />
      </RadialGradient>
    </Defs>
    <Path 
      d="M12 2l2.4 2.4 3.4-.7.7 3.4L21 9.6v4.8l-2.5 2.5-.7 3.4-3.4-.7L12 22l-2.4-2.4-3.4.7-.7-3.4L3 14.4V9.6l2.5-2.5.7-3.4 3.4.7L12 2z" 
      fill="url(#gearGradient)" 
      stroke={color} 
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="2" fill={color} opacity="0.8" />
    <Path 
      d="M12 8v1M12 15v1M8 12h1M15 12h1" 
      stroke={color} 
      strokeWidth="1" 
      opacity="0.6"
    />
    <Circle cx="12" cy="6" r="0.5" fill={color} opacity="0.4" />
    <Circle cx="12" cy="18" r="0.5" fill={color} opacity="0.4" />
    <Circle cx="6" cy="12" r="0.5" fill={color} opacity="0.4" />
    <Circle cx="18" cy="12" r="0.5" fill={color} opacity="0.4" />
  </Svg>
);

export const PremiumIcon = ({ size = 24, color = '#F59E0B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#F59E0B" />
        <Stop offset="50%" stopColor="#D97706" />
        <Stop offset="100%" stopColor="#92400E" />
      </LinearGradient>
    </Defs>
    <Path 
      d="M5 16l2-8 3 4 2-6 2 6 3-4 2 8H5z" 
      fill="url(#crownGradient)" 
      stroke={color} 
      strokeWidth="1.5"
    />
    <Path 
      d="M5 16h14v2c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-2z" 
      fill={color} 
      opacity="0.8"
    />
    <Circle cx="7" cy="8" r="1.5" fill={color} opacity="0.6" />
    <Circle cx="12" cy="6" r="1.5" fill={color} opacity="0.8" />
    <Circle cx="17" cy="8" r="1.5" fill={color} opacity="0.6" />
    <Path 
      d="M12 10l1 2-1 2-1-2 1-2z" 
      fill={color} 
      opacity="0.9"
    />
    <Circle cx="9" cy="14" r="0.5" fill={color} opacity="0.4" />
    <Circle cx="15" cy="14" r="0.5" fill={color} opacity="0.4" />
  </Svg>
);

export const ProfileIcon = ({ size = 24, color = '#F59E0B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Defs>
      <RadialGradient id="profileGradient" cx="50%" cy="30%" r="70%">
        <Stop offset="0%" stopColor="#8B5CF6" />
        <Stop offset="100%" stopColor="#2D1B69" />
      </RadialGradient>
    </Defs>
    <Circle cx="12" cy="12" r="10" fill="url(#profileGradient)" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="9" r="3" fill="none" stroke={color} strokeWidth="1.5" />
    <Path 
      d="M6 20c0-4 2.7-6 6-6s6 2 6 6" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="9" r="1.5" fill={color} opacity="0.6" />
    <Path 
      d="M8 6l1 1M16 6l-1 1M8 18l1-1M16 18l-1-1" 
      stroke={color} 
      strokeWidth="0.8" 
      opacity="0.3"
    />
    <Circle cx="12" cy="4" r="0.5" fill={color} opacity="0.4" />
    <Circle cx="12" cy="20" r="0.5" fill={color} opacity="0.4" />
  </Svg>
);