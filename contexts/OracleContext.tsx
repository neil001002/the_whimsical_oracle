import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getLiveKitService, LiveKitVoiceService } from '@/services/LiveKitService';

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
  playOmenVoice: (text: string, personaVoiceStyle: string) => Promise<void>;
  stopVoice: () => Promise<void>;
  isLoading: boolean;
  isPlayingVoice: boolean;
  voiceError: string | null;
  isVoiceServiceAvailable: boolean;
  // LiveKit specific methods
  connectToVoiceChat: () => Promise<void>;
  disconnectFromVoiceChat: () => Promise<void>;
  startVoiceRecording: () => Promise<void>;
  stopVoiceRecording: () => Promise<void>;
  isVoiceChatConnected: boolean;
  isVoiceRecording: boolean;
  voiceChatError: string | null;
  isLiveKitAvailable: boolean;
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
  const [isVoiceServiceAvailable, setIsVoiceServiceAvailable] = useState(true);
  
  // LiveKit specific state
  const [isVoiceChatConnected, setIsVoiceChatConnected] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceChatError, setVoiceChatError] = useState<string | null>(null);
  const [isLiveKitAvailable, setIsLiveKitAvailable] = useState(false);
  
  const liveKitServiceRef = useRef<LiveKitVoiceService | null>(null);

  useEffect(() => {
    initializeLiveKit();
    
    // Configure audio for mobile platforms
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }

    return () => {
      // Cleanup LiveKit
      if (liveKitServiceRef.current) {
        liveKitServiceRef.current.disconnectVoiceSession();
      }
    };
  }, []);

  // Load user data when user profile changes
  useEffect(() => {
    if (userProfile) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [userProfile]);

  const initializeLiveKit = async () => {
    try {
      liveKitServiceRef.current = getLiveKitService();
      const available = liveKitServiceRef.current.isServiceAvailable();
      setIsLiveKitAvailable(available);
      
      if (!available) {
        console.log('LiveKit voice chat not available on this platform or build configuration');
        setVoiceChatError('Voice chat requires a custom development build. LiveKit features are disabled.');
        
        // Check if native speech or web speech API is available as fallback for TTS
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          try {
            // Check if expo-speech is available
            require('expo-speech');
            console.log('Using Expo Speech API for voice features');
            setIsVoiceServiceAvailable(true);
          } catch (error) {
            console.log('Expo Speech not available');
            setIsVoiceServiceAvailable(false);
          }
        } else if (Platform.OS === 'web' && 'speechSynthesis' in window) {
          console.log('Using Web Speech API as fallback for voice features');
          setIsVoiceServiceAvailable(true);
        } else {
          console.log('No voice services available on this platform');
          setIsVoiceServiceAvailable(false);
        }
        return;
      }

      // Set up event handlers
      liveKitServiceRef.current.setEventHandlers({
        onConnectionStateChanged: (connected) => {
          setIsVoiceChatConnected(connected);
          if (!connected) {
            setIsVoiceRecording(false);
          }
        },
        onError: (error) => {
          setVoiceChatError(error);
          console.error('LiveKit error:', error);
        },
        onAudioReceived: (audioData) => {
          // Handle received audio data for real-time chat
          console.log('Received audio data:', audioData.byteLength);
        },
        onSpeechStarted: () => {
          setIsPlayingVoice(true);
        },
        onSpeechEnded: () => {
          setIsPlayingVoice(false);
        },
      });
    } catch (error) {
      console.error('Failed to initialize LiveKit:', error);
      setVoiceChatError('Failed to initialize voice chat service');
      setIsLiveKitAvailable(false);
      
      // Check if native speech or web speech API is available as fallback
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        try {
          // Check if expo-speech is available
          require('expo-speech');
          console.log('Using Expo Speech API for voice features');
          setIsVoiceServiceAvailable(true);
        } catch (speechError) {
          console.log('Expo Speech not available');
          setIsVoiceServiceAvailable(false);
        }
      } else if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        console.log('Using Web Speech API as fallback for voice features');
        setIsVoiceServiceAvailable(true);
      } else {
        setIsVoiceServiceAvailable(false);
      }
    }
  };

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
      setIsPlayingVoice(false);
      
      // Stop LiveKit TTS if available and being used
      if (liveKitServiceRef.current && isLiveKitAvailable) {
        await liveKitServiceRef.current.stopSpeaking();
      }
      
      // Stop native speech on mobile platforms
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        try {
          const { Speech } = require('expo-speech');
          await Speech.stop();
        } catch (error) {
          console.log('Expo Speech not available for stopping');
        }
      }
      
      // Stop Web Speech API if being used
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  };

  const getVoiceConfigForPersona = (personaVoiceStyle: string) => {
    // Configure voice parameters based on persona
    switch (personaVoiceStyle) {
      case 'wise, ancient, mystical':
        return { rate: 0.8, pitch: 0.9, volume: 0.9 };
      case 'scholarly, quirky, reference-rich':
        return { rate: 1.1, pitch: 1.0, volume: 0.8 };
      case 'playful, optimistic, nature-loving':
        return { rate: 1.2, pitch: 1.1, volume: 0.9 };
      case 'mysterious, cryptic, mineral-focused':
        return { rate: 0.9, pitch: 0.8, volume: 0.7 };
      case 'temporal, mysterious, time-focused':
        return { rate: 0.85, pitch: 0.95, volume: 0.8 };
      default:
        return { rate: 1.0, pitch: 1.0, volume: 0.8 };
    }
  };

  const playOmenVoice = async (text: string, personaVoiceStyle: string) => {
    if (!userPreferences.voiceEnabled) {
      return;
    }

    // Check if voice service is available - if not, set error and return gracefully
    if (!isVoiceServiceAvailable) {
      setVoiceError('Voice service is not available on this platform. Voice features require either Web Speech API (web) or Expo Speech (mobile).');
      return;
    }

    // Clear any previous errors
    setVoiceError(null);

    // Stop any currently playing audio
    await stopVoice();

    try {
      setIsPlayingVoice(true);
      
      // Use native speech for mobile platforms
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        try {
          const { Speech } = require('expo-speech');
          
          // Apply voice configuration
          const voiceConfig = getVoiceConfigForPersona(personaVoiceStyle);
          
          const options = {
            rate: voiceConfig.rate,
            pitch: voiceConfig.pitch,
            volume: voiceConfig.volume,
            language: 'en-US',
            onDone: () => {
              setIsPlayingVoice(false);
            },
            onError: (error: any) => {
              console.error('Speech error:', error);
              setIsPlayingVoice(false);
              setVoiceError(`Speech synthesis error: ${error}`);
            },
          };

          await Speech.speak(text, options);
          return;
        } catch (error) {
          console.error('Expo Speech not available:', error);
          setVoiceError('Native speech synthesis not available on this device');
          setIsPlayingVoice(false);
          return;
        }
      }
      
      // Use Web Speech API for web platform
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        return new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Apply voice configuration
          const voiceConfig = getVoiceConfigForPersona(personaVoiceStyle);
          utterance.rate = voiceConfig.rate;
          utterance.pitch = voiceConfig.pitch;
          utterance.volume = voiceConfig.volume;
          
          // Try to find a suitable voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('alex')
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          utterance.onend = () => {
            setIsPlayingVoice(false);
            resolve();
          };

          utterance.onerror = (event) => {
            setIsPlayingVoice(false);
            reject(new Error(`Speech synthesis error: ${event.error}`));
          };

          window.speechSynthesis.speak(utterance);
        });
      }
      
      // If LiveKit is available, try using it as a fallback
      if (liveKitServiceRef.current && isLiveKitAvailable) {
        // Configure voice based on persona
        const voiceConfig = getVoiceConfigForPersona(personaVoiceStyle);
        
        const status = liveKitServiceRef.current.getSessionStatus();
        if (!status.isConnected) {
          const roomName = `oracle-tts-${Date.now()}`;
          const participantName = `oracle-${selectedPersona.id}`;
          await liveKitServiceRef.current.connectToVoiceSession(roomName, participantName);
        }

        await liveKitServiceRef.current.speakText(text, voiceConfig);
        setIsVoiceServiceAvailable(true);
        return;
      }
      
      // If no voice service is available
      throw new Error('No voice synthesis service available on this platform');
      
    } catch (error) {
      console.error('Error playing omen voice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setVoiceError(`Voice playback failed: ${errorMessage}`);
      setIsPlayingVoice(false);
    }
  };

  // LiveKit voice chat methods
  const connectToVoiceChat = async () => {
    if (!liveKitServiceRef.current || !userPreferences.realTimeChatEnabled || !isLiveKitAvailable) {
      setVoiceChatError('Voice chat not available. Requires custom development build with WebRTC support.');
      return;
    }

    try {
      setVoiceChatError(null);
      const roomName = `oracle-chat-${selectedPersona.id}`;
      const participantName = `user-${Date.now()}`;
      
      await liveKitServiceRef.current.connectToVoiceSession(roomName, participantName);
    } catch (error) {
      console.error('Error connecting to voice chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setVoiceChatError(`Failed to connect to voice chat: ${errorMessage}`);
    }
  };

  const disconnectFromVoiceChat = async () => {
    if (!liveKitServiceRef.current) {
      return;
    }

    try {
      await liveKitServiceRef.current.disconnectVoiceSession();
      setIsVoiceRecording(false);
    } catch (error) {
      console.error('Error disconnecting from voice chat:', error);
    }
  };

  const startVoiceRecording = async () => {
    if (!liveKitServiceRef.current || !isVoiceChatConnected || !isLiveKitAvailable) {
      setVoiceChatError('Voice chat not connected or not available');
      return;
    }

    try {
      await liveKitServiceRef.current.startRecording();
      setIsVoiceRecording(true);
    } catch (error) {
      console.error('Error starting voice recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setVoiceChatError(`Failed to start recording: ${errorMessage}`);
    }
  };

  const stopVoiceRecording = async () => {
    if (!liveKitServiceRef.current) {
      return;
    }

    try {
      await liveKitServiceRef.current.stopRecording();
      setIsVoiceRecording(false);
    } catch (error) {
      console.error('Error stopping voice recording:', error);
    }
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

    // Play voice narration if enabled and service is available
    if (userPreferences.voiceEnabled && isVoiceServiceAvailable) {
      const persona = ORACLE_PERSONAS.find(p => p.id === omen.persona);
      if (persona) {
        const fullText = `${omen.crypticPhrase}. ${omen.interpretation}. ${omen.advice}`;
        try {
          await playOmenVoice(fullText, persona.voiceStyle);
        } catch (error) {
          // Don't throw error for voice playback failures, just log them
          console.log('Voice playback failed for new omen:', error);
        }
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
      isVoiceServiceAvailable,
      // LiveKit methods
      connectToVoiceChat,
      disconnectFromVoiceChat,
      startVoiceRecording,
      stopVoiceRecording,
      isVoiceChatConnected,
      isVoiceRecording,
      voiceChatError,
      isLiveKitAvailable,
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