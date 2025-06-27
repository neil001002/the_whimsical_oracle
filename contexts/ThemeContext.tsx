import React, { createContext, useContext } from 'react';

// Define theme colors
const COLORS = {
  // Primary mystical colors
  primary: '#2D1B69',      // Deep space purple
  secondary: '#1E3A8A',    // Cosmic blue
  accent: '#F59E0B',       // Mystical gold
  background: '#0F0F23',   // Dark cosmos
  surface: '#1A1A2E',      // Dark surface
  text: '#F8FAFC',         // Starlight white
  textSecondary: '#CBD5E1', // Muted starlight
  
  // Gradient colors
  gradients: {
    cosmic: ['#2D1B69', '#1E3A8A'],
    starlight: ['#F8FAFC', '#CBD5E1'],
    mystic: ['#7C3AED', '#F59E0B'],
    aurora: ['#10B981', '#3B82F6', '#8B5CF6'],
  },
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Transparency levels
  overlay: 'rgba(15, 15, 35, 0.8)',
  glass: 'rgba(255, 255, 255, 0.1)',
  glassStrong: 'rgba(255, 255, 255, 0.2)',
};

const FONTS = {
  title: 'Cinzel_600SemiBold',
  titleRegular: 'Cinzel_400Regular',
  body: 'PlayfairDisplay_400Regular',
  bodyBold: 'PlayfairDisplay_700Bold',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
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
};

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

type ThemeContextType = {
  colors: typeof COLORS;
  fonts: typeof FONTS;
  spacing: typeof SPACING;
  shadows: typeof SHADOWS;
  borderRadius: typeof BORDER_RADIUS;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: ThemeContextType = {
    colors: COLORS,
    fonts: FONTS,
    spacing: SPACING,
    shadows: SHADOWS,
    borderRadius: BORDER_RADIUS,
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