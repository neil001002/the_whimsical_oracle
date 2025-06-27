import React, { createContext, useContext, ReactNode } from 'react';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '@/constants/Theme';

interface ThemeContextType {
  colors: typeof COLORS;
  fonts: typeof FONTS;
  spacing: typeof SPACING;
  shadows: typeof SHADOWS;
  borderRadius: typeof BORDER_RADIUS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
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