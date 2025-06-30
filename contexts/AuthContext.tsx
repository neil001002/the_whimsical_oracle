import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { supabase, SupabaseService } from '@/lib/supabase';
import { User, AuthSession, SignUpData, SignInData, UserProfile } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: AuthSession;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (data: SignInData) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  userProfile: UserProfile | null;
  loading: boolean;
  // Enhanced methods for comprehensive data sync
  syncUserData: (data: any) => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  updateSubscription: (tier: 'free' | 'premium' | 'mystic', status: any) => Promise<void>;
  trackActivity: (activity: string, metadata?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    session: null,
    loading: true,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession({
        user: session?.user ? transformUser(session.user) : null,
        session,
        loading: false,
      });
      setLoading(false);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
        startUserSession(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession({
          user: session?.user ? transformUser(session.user) : null,
          session,
          loading: false,
        });
        setLoading(false);

        if (session?.user) {
          await loadUserProfile(session.user.id);
          await startUserSession(session.user.id);
        } else {
          setUserProfile(null);
          await endUserSession();
        }
      }
    );

    // Cleanup session on unmount
    return () => {
      subscription.unsubscribe();
      endUserSession();
    };
  }, []);

  const transformUser = (user: any): User => ({
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username,
    avatar_url: user.user_metadata?.avatar_url,
    subscription_tier: 'free',
    created_at: user.created_at,
    updated_at: user.updated_at,
  });

  const startUserSession = async (userId: string) => {
    try {
      const sessionData = await SupabaseService.startUserSession(
        userId,
        Platform.OS,
        '1.0.0' // App version
      );
      if (sessionData) {
        setCurrentSessionId(sessionData.id);
      }
    } catch (error) {
      console.error('Error starting user session:', error);
    }
  };

  const endUserSession = async () => {
    if (currentSessionId) {
      try {
        await SupabaseService.endUserSession(currentSessionId);
        setCurrentSessionId(null);
      } catch (error) {
        console.error('Error ending user session:', error);
      }
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          id: data.id,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
          subscription_tier: data.subscription_tier,
          language: data.language || 'en',
          preferences: data.preferences || {
            selectedPersona: 'cosmic-sage',
            soundEnabled: true,
            hapticsEnabled: true,
            voiceEnabled: true,
            realTimeChatEnabled: true,
          },
          stats: data.stats || {
            totalReadings: 0,
            streakDays: 0,
            favoriteCategory: 'growth',
            joinDate: new Date().toISOString(),
          },
          settings: data.settings || {
            notifications: {
              email: true,
              push: true,
              dailyReminder: false,
              reminderTime: '09:00',
            },
            privacy: {
              profileVisible: false,
              shareReadings: false,
            },
            accessibility: {
              highContrast: false,
              largeText: false,
              reduceMotion: false,
            },
          },
          subscriptionStatus: data.subscription_status || {
            tier: 'free',
            isActive: false,
            expirationDate: null,
            willRenew: false,
          },
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signUp = async ({ email, password, username }: SignUpData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { error };
      }

      // Create user profile with enhanced data
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username || email.split('@')[0],
            subscription_tier: 'free',
            language: 'en', // Default language
            preferences: {
              selectedPersona: 'cosmic-sage',
              soundEnabled: true,
              hapticsEnabled: true,
              voiceEnabled: true,
              realTimeChatEnabled: true,
            },
            stats: {
              totalReadings: 0,
              streakDays: 0,
              favoriteCategory: 'growth',
              joinDate: new Date().toISOString(),
            },
            settings: {
              notifications: {
                email: true,
                push: true,
                dailyReminder: false,
                reminderTime: '09:00',
              },
              privacy: {
                profileVisible: false,
                shareReadings: false,
              },
              accessibility: {
                highContrast: false,
                largeText: false,
                reduceMotion: false,
              },
            },
            subscription_status: {
              tier: 'free',
              isActive: false,
              expirationDate: null,
              willRenew: false,
              lastUpdated: new Date().toISOString(),
            },
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async ({ email, password }: SignInData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await endUserSession();
      await supabase.auth.signOut();
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!session.user) {
        return { error: new Error('No user logged in') };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) {
        return { error };
      }

      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (session.user) {
      await loadUserProfile(session.user.id);
    }
  };

  // Enhanced sync method for comprehensive data synchronization
  const syncUserData = async (data: any) => {
    if (!session.user) return;

    try {
      await SupabaseService.syncUserData(session.user.id, data);
      
      // Refresh local profile data
      await refreshProfile();
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  // Update user language with sync
  const updateLanguage = async (language: string) => {
    if (!session.user) return;

    try {
      await SupabaseService.updateUserLanguage(session.user.id, language);
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, language });
      }
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  // Update subscription with comprehensive tracking
  const updateSubscription = async (
    tier: 'free' | 'premium' | 'mystic',
    status: any
  ) => {
    if (!session.user) return;

    try {
      const oldTier = userProfile?.subscription_tier || 'free';
      
      await SupabaseService.updateSubscriptionStatus(session.user.id, tier, status);
      
      // Track subscription event
      await SupabaseService.trackSubscriptionEvent(
        session.user.id,
        oldTier === 'free' && tier !== 'free' ? 'purchase' : 'change',
        oldTier,
        tier,
        status.provider,
        status.transactionId,
        status.amountCents,
        status
      );
      
      // Refresh profile
      await refreshProfile();
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  // Track user activity
  const trackActivity = async (activity: string, metadata?: any) => {
    if (!session.user) return;

    try {
      // This could be enhanced to track activities in the session
      console.log('Activity tracked:', activity, metadata);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
        userProfile,
        loading,
        syncUserData,
        updateLanguage,
        updateSubscription,
        trackActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}