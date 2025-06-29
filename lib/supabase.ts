import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create storage adapter for different platforms
const createStorageAdapter = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        if (typeof localStorage === 'undefined') {
          return null;
        }
        return localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        if (typeof localStorage === 'undefined') {
          return;
        }
        localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        if (typeof localStorage === 'undefined') {
          return;
        }
        localStorage.removeItem(key);
      },
    };
  }
  
  return AsyncStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          subscription_tier: 'free' | 'premium' | 'mystic';
          preferences: any;
          stats: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          subscription_tier?: 'free' | 'premium' | 'mystic';
          preferences?: any;
          stats?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          subscription_tier?: 'free' | 'premium' | 'mystic';
          preferences?: any;
          stats?: any;
          updated_at?: string;
        };
      };
      omens: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          cryptic_phrase: string;
          interpretation: string;
          advice: string;
          confidence: number;
          category: string;
          persona: string;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symbol: string;
          cryptic_phrase: string;
          interpretation: string;
          advice: string;
          confidence: number;
          category: string;
          persona: string;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          symbol?: string;
          cryptic_phrase?: string;
          interpretation?: string;
          advice?: string;
          confidence?: number;
          category?: string;
          persona?: string;
          rating?: number | null;
        };
      };
    };
  };
}