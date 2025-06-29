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
}