import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getElevenLabsService } from '@/services/ElevenLabsService';

interface OraclePersona {
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

interface WhimsicalOmen {
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

type OmenCategory = 
  | 'career'
  | 'relationships'
  | 'health'
  | 'creativity'
  | 'finance'
  | 'growth';

interface UserPreferences {
  selectedPersona: string;
  notificationTime?: Date;
  subscriptionTier: 'free' | 'premium' | 'mystic';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  voiceEnabled: boolean;
  realTimeChatEnabled: boolean;
}

interface OracleContextType {
  selectedPersona: OraclePersona;
  userPreferences: UserPreferences;
  omenHistory: WhimsicalOmen[];
  updatePersona: (personaId: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addOmen: (omen: WhimsicalOmen) => void;
  rateOmen: (omenId: string, rating: number) => void;
  playOmenVoice: (text: string, personaId: string) => Promise<void>;
  stopVoice: () => Promise<void>;
  isLoading: boolean;
  isPlayingVoice: boolean;
  voiceError: string | null;
  isVoiceServiceAvailable: boolean;
  testVoice: () => Promise<void>;
  getVoiceServiceStatus: () => any;
}

const OracleContext = createContext<OracleContextType | undefined>(undefined);

export function OracleProvider({ children }: { children: React.ReactNode }) {
  const { session, userProfile } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<OraclePersona>(ORACLE_PERSONAS[0]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    selectedPersona: 'cosmic-sage',
    subscriptionTier: 'free',
    soundEnabled: true,
    hapticsEnabled: true,
    voiceEnabled: true,
    realTimeChatEnabled: true,
  });
  const [omenHistory, setOmenHistory] = useState<WhimsicalOmen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const elevenLabsService = getElevenLabsService();

  useEffect(() => {
    console.log('🔮 OracleProvider initialized');
    
    // Log voice service status
    const status = elevenLabsService.getServiceStatus();
    console.log('🎵 Voice Service Status:', status);
    
    // Configure audio for mobile platforms
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      }).catch(error => {
        console.warn('Failed to configure audio mode:', error);
      });
    }
  }, []);

  // Load user data when user profile changes
  useEffect(() => {
    if (userProfile) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [userProfile]);

  const loadUserData = async () => {
    if (!session.user || !userProfile) {
      setIsLoading(false);
      return;
    }

    try {
      // Load user preferences from profile
      if (userProfile.preferences) {
        setUserPreferences({
          ...userProfile.preferences,
          subscriptionTier: userProfile.subscription_tier,
        });
        
        const persona = ORACLE_PERSONAS.find(p => p.id === userProfile.preferences.selectedPersona);
        if (persona) {
          setSelectedPersona(persona);
        }
      }

      // Load omen history from Supabase
      const { data: omens, error } = await supabase
        .from('omens')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading omens:', error);
      } else if (omens) {
        const transformedOmens = omens.map(omen => ({
          id: omen.id,
          symbol: omen.symbol,
          crypticPhrase: omen.cryptic_phrase,
          interpretation: omen.interpretation,
          advice: omen.advice,
          timestamp: new Date(omen.created_at),
          confidence: omen.confidence,
          category: omen.category as OmenCategory,
          persona: omen.persona,
          rating: omen.rating,
        }));
        setOmenHistory(transformedOmens);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersona = async (personaId: string) => {
    const persona = ORACLE_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      setSelectedPersona(persona);
      const newPrefs = { ...userPreferences, selectedPersona: personaId };
      setUserPreferences(newPrefs);
      
      // Update in Supabase if user is logged in
      if (session.user && userProfile) {
        try {
          await supabase
            .from('profiles')
            .update({
              preferences: { ...userProfile.preferences, selectedPersona: personaId },
              updated_at: new Date().toISOString(),
            })
            .eq('id', session.user.id);
        } catch (error) {
          console.error('Error updating persona:', error);
        }
      }
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    const newPrefs = { ...userPreferences, ...preferences };
    setUserPreferences(newPrefs);
    
    // Update in Supabase if user is logged in
    if (session.user && userProfile) {
      try {
        await supabase
          .from('profiles')
          .update({
            preferences: { ...userProfile.preferences, ...preferences },
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.user.id);
      } catch (error) {
        console.error('Error updating preferences:', error);
      }
    }
  };

  const stopVoice = async () => {
    try {
      console.log('🔮 Stopping voice from Oracle context');
      setIsPlayingVoice(false);
      setVoiceError(null);
      await elevenLabsService.stopSpeech();
    } catch (error) {
      console.error('🔮 Error stopping voice:', error);
    }
  };

  const playOmenVoice = async (text: string, personaId: string) => {
    console.log('🔮 playOmenVoice called:', { 
      personaId, 
      textLength: text.length, 
      voiceEnabled: userPreferences.voiceEnabled,
      serviceStatus: elevenLabsService.getServiceStatus()
    });

    if (!userPreferences.voiceEnabled) {
      console.log('🔮 Voice disabled in preferences');
      return;
    }

    // Clear any previous errors
    setVoiceError(null);

    // Stop any currently playing audio
    await stopVoice();

    try {
      console.log('🔮 Starting voice generation...');
      
      await elevenLabsService.generateSpeech(
        text,
        personaId,
        () => {
          console.log('🔮 Voice started playing');
          setIsPlayingVoice(true);
          setVoiceError(null);
        },
        () => {
          console.log('🔮 Voice finished playing');
          setIsPlayingVoice(false);
        },
        (error: string) => {
          console.error('🔮 Voice playback error:', error);
          setIsPlayingVoice(false);
          setVoiceError(error);
        }
      );
    } catch (error) {
      console.error('🔮 Error playing omen voice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setVoiceError(`Voice playback failed: ${errorMessage}`);
      setIsPlayingVoice(false);
    }
  };

  const testVoice = async () => {
    console.log('🔮 Testing voice functionality...');
    setVoiceError(null);
    
    try {
      const success = await elevenLabsService.testVoice(selectedPersona.id);
      if (success) {
        console.log('🔮 Voice test successful');
        setVoiceError(null);
      } else {
        console.log('🔮 Voice test failed');
        setVoiceError('Voice test failed - check your configuration');
      }
    } catch (error) {
      console.error('🔮 Voice test error:', error);
      setVoiceError('Voice test failed');
    }
  };

  const getVoiceServiceStatus = () => {
    return elevenLabsService.getServiceStatus();
  };

  const addOmen = async (omen: WhimsicalOmen) => {
    // Add to local state first
    const newHistory = [omen, ...omenHistory];
    setOmenHistory(newHistory);

    // Save to Supabase if user is logged in
    if (session.user) {
      try {
        await supabase
          .from('omens')
          .insert({
            id: omen.id,
            user_id: session.user.id,
            symbol: omen.symbol,
            cryptic_phrase: omen.crypticPhrase,
            interpretation: omen.interpretation,
            advice: omen.advice,
            confidence: omen.confidence,
            category: omen.category,
            persona: omen.persona,
            rating: omen.rating,
          });
      } catch (error) {
        console.error('Error saving omen to database:', error);
      }
    }

    // Play voice narration if enabled
    if (userPreferences.voiceEnabled) {
      const fullText = `${omen.crypticPhrase}. ${omen.interpretation}. ${omen.advice}`;
      try {
        console.log('🔮 Auto-playing voice for new omen');
        await playOmenVoice(fullText, omen.persona);
      } catch (error) {
        // Don't throw error for voice playback failures, just log them
        console.log('🔮 Voice playback failed for new omen:', error);
      }
    }
  };

  const rateOmen = async (omenId: string, rating: number) => {
    // Update local state
    const updatedHistory = omenHistory.map(omen =>
      omen.id === omenId ? { ...omen, rating } : omen
    );
    setOmenHistory(updatedHistory);

    // Update in Supabase if user is logged in
    if (session.user) {
      try {
        await supabase
          .from('omens')
          .update({ rating })
          .eq('id', omenId)
          .eq('user_id', session.user.id);
      } catch (error) {
        console.error('Error updating omen rating:', error);
      }
    }
  };

  return (
    <OracleContext.Provider value={{
      selectedPersona,
      userPreferences,
      omenHistory,
      updatePersona,
      updatePreferences,
      addOmen,
      rateOmen,
      playOmenVoice,
      stopVoice,
      isLoading,
      isPlayingVoice,
      voiceError,
      isVoiceServiceAvailable: elevenLabsService.isServiceAvailable(),
      testVoice,
      getVoiceServiceStatus,
    }}>
      {children}
    </OracleContext.Provider>
  );
}

export function useOracle() {
  const context = useContext(OracleContext);
  if (context === undefined) {
    throw new Error('useOracle must be used within an OracleProvider');
  }
  return context;
}

export const ORACLE_PERSONAS: OraclePersona[] = [
  {
    id: 'cosmic-sage',
    name: 'Cosmic Sage',
    description: 'Ancient wisdom from the stars, speaking in cosmic metaphors',
    avatar: '🌟',
    voiceStyle: 'wise, ancient, mystical',
    colorScheme: {
      primary: '#2D1B69',
      secondary: '#1E3A8A',
      accent: '#F59E0B',
    },
    responsePatterns: [
      'The stars whisper of...',
      'In the cosmic dance, I see...',
      'Ancient wisdom reveals...',
      'The universe speaks through...',
    ],
  },
  {
    id: 'mystical-librarian',
    name: 'Mystical Librarian',
    description: 'Bookish wisdom keeper with literary enchantments',
    avatar: '📚',
    voiceStyle: 'scholarly, quirky, reference-rich',
    colorScheme: {
      primary: '#7C2D12',
      secondary: '#1F2937',
      accent: '#D97706',
    },
    responsePatterns: [
      'As written in the tome of fate...',
      'The chronicles reveal...',
      'Between the lines of destiny...',
      'Ancient texts speak of...',
    ],
  },
  {
    id: 'starlight-fairy',
    name: 'Starlight Fairy',
    description: 'Playful forest spirit bringing nature-focused wisdom',
    avatar: '🧚',
    voiceStyle: 'playful, optimistic, nature-loving',
    colorScheme: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#F59E0B',
    },
    responsePatterns: [
      'The forest spirits dance and say...',
      'Moonbeams carry messages of...',
      'Nature\'s magic reveals...',
      'The fairy realm whispers...',
    ],
  },
  {
    id: 'crystal-prophet',
    name: 'Crystal Prophet',
    description: 'Mysterious seer channeling gemstone energies',
    avatar: '🔮',
    voiceStyle: 'mysterious, cryptic, mineral-focused',
    colorScheme: {
      primary: '#7C3AED',
      secondary: '#5B21B6',
      accent: '#EC4899',
    },
    responsePatterns: [
      'The crystals resonate with...',
      'Through the crystal\'s clarity, I see...',
      'Gemstone energies reveal...',
      'The sacred stones speak of...',
    ],
  },
  {
    id: 'time-weaver',
    name: 'Time Weaver',
    description: 'Temporal guardian connecting past, present, and future',
    avatar: '⏳',
    voiceStyle: 'temporal, mysterious, time-focused',
    colorScheme: {
      primary: '#1E40AF',
      secondary: '#3730A3',
      accent: '#F59E0B',
    },
    responsePatterns: [
      'Threads of time reveal...',
      'Past and future converge to show...',
      'The temporal streams whisper...',
      'Time\'s tapestry weaves...',
    ],
  },
];