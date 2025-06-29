import React, { createContext, useContext } from 'react';

// Enhanced theme colors based on reference images
const COLORS = {
  // Primary mystical colors - enhanced based on reference
  primary: '#1A0B2E',      // Deeper mystical purple
  secondary: '#2D1B69',    // Rich cosmic purple
  accent: '#D4AF37',       // Mystical gold
  accentSecondary: '#9D4EDD', // Ethereal purple
  background: '#0A0A0F',   // Deep cosmic black
  surface: '#1A1A2E',      // Dark surface with purple tint
  surfaceElevated: '#2A2A3E', // Elevated surface
  text: '#F8FAFC',         // Starlight white
  textSecondary: '#B8BCC8', // Muted starlight
  textTertiary: '#8B8B9A', // Subtle text
  
  // Gradient colors - enhanced mystical gradients
  gradients: {
    cosmic: ['#1A0B2E', '#2D1B69', '#4C1D95'],
    starlight: ['#F8FAFC', '#E2E8F0', '#CBD5E1'],
    mystic: ['#7C3AED', '#9D4EDD', '#D4AF37'],
    aurora: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
    ethereal: ['#1A0B2E', '#2D1B69', '#7C3AED', '#9D4EDD'],
    golden: ['#D4AF37', '#F59E0B', '#FBBF24'],
  },
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Transparency levels - enhanced for mystical effects
  overlay: 'rgba(10, 10, 15, 0.85)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassStrong: 'rgba(255, 255, 255, 0.15)',
  glassMystic: 'rgba(157, 78, 221, 0.1)',
  glassGolden: 'rgba(212, 175, 55, 0.1)',
  
  // Border colors
  border: 'rgba(255, 255, 255, 0.1)',
  borderStrong: 'rgba(255, 255, 255, 0.2)',
  borderMystic: 'rgba(157, 78, 221, 0.3)',
  borderGolden: 'rgba(212, 175, 55, 0.3)',
};

const FONTS = {
  title: 'Cinzel_600SemiBold',
  titleRegular: 'Cinzel_400Regular',
  body: 'PlayfairDisplay_400Regular',
  bodyBold: 'PlayfairDisplay_700Bold',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 19,
    xxl: 22,
    xxxl: 28,
    display: 42,
    hero: 56,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  massive: 96,
};

const SHADOWS = {
  small: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  mystical: {
    shadowColor: COLORS.accentSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  cosmic: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

const ANIMATIONS = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
    mystical: 800,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    mystical: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
};

type ThemeContextType = {
  colors: typeof COLORS;
  fonts: typeof FONTS;
  spacing: typeof SPACING;
  shadows: typeof SHADOWS;
  borderRadius: typeof BORDER_RADIUS;
  animations: typeof ANIMATIONS;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: ThemeContextType = {
    colors: COLORS,
    fonts: FONTS,
    spacing: SPACING,
    shadows: SHADOWS,
    borderRadius: BORDER_RADIUS,
    animations: ANIMATIONS,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}