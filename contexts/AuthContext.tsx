import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
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

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username || email.split('@')[0],
            subscription_tier: 'free',
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