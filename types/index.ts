export interface OraclePersona {
  id: string;
  name: string;
  description: string;
  avatar: string;
  voiceStyle: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  responsePatterns: string[];
}

export interface WhimsicalOmen {
  id: string;
  symbol: string;
  crypticPhrase: string;
  interpretation: string;
  advice: string;
  timestamp: Date;
  confidence: number;
  category: OmenCategory;
  persona: string;
  rating?: number;
}

export type OmenCategory = 
  | 'career'
  | 'relationships'
  | 'health'
  | 'creativity'
  | 'finance'
  | 'growth';

export interface UserPreferences {
  selectedPersona: string;
  notificationTime?: Date;
  subscriptionTier: 'free' | 'premium' | 'mystic';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  voiceEnabled: boolean;
}

export interface NavigationParams {
  Home: undefined;
  History: undefined;
  Settings: undefined;
  Premium: undefined;
  Onboarding: undefined;
}