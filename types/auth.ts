export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'premium' | 'mystic';
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User | null;
  session: any | null;
  loading: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  subscription_tier: 'free' | 'premium' | 'mystic';
  language: string;
  preferences: {
    selectedPersona: string;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    voiceEnabled: boolean;
    realTimeChatEnabled: boolean;
  };
  stats: {
    totalReadings: number;
    streakDays: number;
    favoriteCategory: string;
    joinDate: string;
  };
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      dailyReminder: boolean;
      reminderTime: string;
    };
    privacy: {
      profileVisible: boolean;
      shareReadings: boolean;
    };
    accessibility: {
      highContrast: boolean;
      largeText: boolean;
      reduceMotion: boolean;
    };
  };
  subscriptionStatus: {
    tier: 'free' | 'premium' | 'mystic';
    isActive: boolean;
    expirationDate: string | null;
    willRenew: boolean;
    provider?: string;
    productId?: string;
    lastUpdated?: string;
  };
}