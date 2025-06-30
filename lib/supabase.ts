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

// Enhanced Database types with new tables and fields
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
          language: string;
          preferences: any;
          stats: any;
          subscription_status: any;
          settings: any;
          last_active: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          subscription_tier?: 'free' | 'premium' | 'mystic';
          language?: string;
          preferences?: any;
          stats?: any;
          subscription_status?: any;
          settings?: any;
          last_active?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          subscription_tier?: 'free' | 'premium' | 'mystic';
          language?: string;
          preferences?: any;
          stats?: any;
          subscription_status?: any;
          settings?: any;
          last_active?: string;
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
      subscription_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          from_tier: string | null;
          to_tier: string;
          provider: string | null;
          provider_transaction_id: string | null;
          amount_cents: number | null;
          currency: string;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          from_tier?: string | null;
          to_tier: string;
          provider?: string | null;
          provider_transaction_id?: string | null;
          amount_cents?: number | null;
          currency?: string;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_type?: string;
          from_tier?: string | null;
          to_tier?: string;
          provider?: string | null;
          provider_transaction_id?: string | null;
          amount_cents?: number | null;
          currency?: string;
          metadata?: any;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_start: string;
          session_end: string | null;
          platform: string | null;
          app_version: string | null;
          device_info: any;
          activities: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_start?: string;
          session_end?: string | null;
          platform?: string | null;
          app_version?: string | null;
          device_info?: any;
          activities?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_start?: string;
          session_end?: string | null;
          platform?: string | null;
          app_version?: string | null;
          device_info?: any;
          activities?: any;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          preference_key: string;
          preference_value: any;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          preference_key: string;
          preference_value: any;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          preference_key?: string;
          preference_value?: any;
          updated_at?: string;
        };
      };
    };
  };
}

// Supabase service functions for enhanced data management
export class SupabaseService {
  // Track user session
  static async startUserSession(userId: string, platform: string, appVersion?: string) {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          platform,
          app_version: appVersion,
          device_info: {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            platform: Platform.OS,
            timestamp: new Date().toISOString(),
          },
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting user session:', error);
      return null;
    }
  }

  // End user session
  static async endUserSession(sessionId: string, activities: any[] = []) {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          session_end: new Date().toISOString(),
          activities,
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error ending user session:', error);
    }
  }

  // Update user preference
  static async updateUserPreference(
    userId: string,
    category: string,
    key: string,
    value: any
  ) {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          category,
          preference_key: key,
          preference_value: value,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user preference:', error);
    }
  }

  // Get user preferences by category
  static async getUserPreferences(userId: string, category?: string) {
    try {
      let query = supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return [];
    }
  }

  // Track subscription event
  static async trackSubscriptionEvent(
    userId: string,
    eventType: string,
    fromTier: string | null,
    toTier: string,
    provider?: string,
    transactionId?: string,
    amountCents?: number,
    metadata?: any
  ) {
    try {
      const { error } = await supabase
        .from('subscription_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          from_tier: fromTier,
          to_tier: toTier,
          provider,
          provider_transaction_id: transactionId,
          amount_cents: amountCents,
          metadata: metadata || {},
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking subscription event:', error);
    }
  }

  // Update subscription status
  static async updateSubscriptionStatus(
    userId: string,
    tier: 'free' | 'premium' | 'mystic',
    status: {
      isActive: boolean;
      expirationDate?: string | null;
      willRenew?: boolean;
      provider?: string;
      productId?: string;
    }
  ) {
    try {
      const subscriptionStatus = {
        tier,
        isActive: status.isActive,
        expirationDate: status.expirationDate,
        willRenew: status.willRenew || false,
        provider: status.provider,
        productId: status.productId,
        lastUpdated: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: tier,
          subscription_status: subscriptionStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  }

  // Update user language
  static async updateUserLanguage(userId: string, language: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Also track as preference
      await this.updateUserPreference(userId, 'language', 'current', language);
    } catch (error) {
      console.error('Error updating user language:', error);
    }
  }

  // Get user analytics
  static async getUserAnalytics(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get omens count
      const { data: omens, error: omensError } = await supabase
        .from('omens')
        .select('id, created_at, category, rating')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (omensError) throw omensError;

      // Get sessions count
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('id, session_start, session_end, platform')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (sessionsError) throw sessionsError;

      // Get subscription events
      const { data: subscriptionEvents, error: subError } = await supabase
        .from('subscription_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (subError) throw subError;

      return {
        omens: omens || [],
        sessions: sessions || [],
        subscriptionEvents: subscriptionEvents || [],
        period: { days, startDate: startDate.toISOString() },
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  // Sync all user data (comprehensive sync function)
  static async syncUserData(userId: string, userData: {
    preferences?: any;
    language?: string;
    subscriptionTier?: 'free' | 'premium' | 'mystic';
    subscriptionStatus?: any;
    settings?: any;
    stats?: any;
  }) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      };

      if (userData.preferences) updateData.preferences = userData.preferences;
      if (userData.language) updateData.language = userData.language;
      if (userData.subscriptionTier) updateData.subscription_tier = userData.subscriptionTier;
      if (userData.subscriptionStatus) updateData.subscription_status = userData.subscriptionStatus;
      if (userData.settings) updateData.settings = userData.settings;
      if (userData.stats) updateData.stats = userData.stats;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      console.log('User data synced successfully');
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }
}