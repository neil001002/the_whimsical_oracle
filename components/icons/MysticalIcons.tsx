import React from 'react';
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';
import HomeSVG from '../../assets/icons/home.svg';
import HistorySVG from '../../assets/icons/history.svg';
import SettingsSVG from '../../assets/icons/settings.svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const HomeIcon = ({ size = 24 }: IconProps) => (
  <HomeSVG width={size} height={size} />
);

export const HistoryIcon = ({ size = 24 }: IconProps) => (
  <HistorySVG width={size} height={size} />
);

export const SettingsIcon = ({ size = 24 }: IconProps) => (
  <SettingsSVG width={size} height={size} />
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
    <Path d="M12 10l1 2-1 2-1-2 1-2z" fill={color} opacity="0.9" />
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
    <Circle
      cx="12"
      cy="12"
      r="10"
      fill="url(#profileGradient)"
      stroke={color}
      strokeWidth="1.5"
    />
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
