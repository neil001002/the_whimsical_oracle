import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { ELEVEN_LABS_VOICE_MAP } from '@/constants/ElevenLabsVoices';

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
}

const OracleContext = createContext<OracleContextType | undefined>(undefined);

export function OracleProvider({ children }: { children: React.ReactNode }) {
  const [selectedPersona, setSelectedPersona] = useState<OraclePersona>(ORACLE_PERSONAS[0]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    selectedPersona: 'cosmic-sage',
    subscriptionTier: 'free',
    soundEnabled: true,
    hapticsEnabled: true,
    voiceEnabled: false,
  });
  const [omenHistory, setOmenHistory] = useState<WhimsicalOmen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isVoiceServiceAvailable, setIsVoiceServiceAvailable] = useState(true);
  const soundObjectRef = useRef<Audio.Sound | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadUserData();
    
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
      // Cleanup audio when component unmounts
      if (Platform.OS === 'web') {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current = null;
        }
      } else {
        if (soundObjectRef.current) {
          soundObjectRef.current.unloadAsync();
        }
      }
    };
  }, []);

  const loadUserData = async () => {
    try {
      const [prefsData, historyData] = await Promise.all([
        AsyncStorage.getItem('userPreferences'),
        AsyncStorage.getItem('omenHistory'),
      ]);

      if (prefsData) {
        const prefs = JSON.parse(prefsData);
        setUserPreferences(prefs);
        const persona = ORACLE_PERSONAS.find(p => p.id === prefs.selectedPersona);
        if (persona) {
          setSelectedPersona(persona);
        }
      }

      if (historyData) {
        const history = JSON.parse(historyData).map((omen: any) => ({
          ...omen,
          timestamp: new Date(omen.timestamp),
        }));
        setOmenHistory(history);
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
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    const newPrefs = { ...userPreferences, ...preferences };
    setUserPreferences(newPrefs);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPrefs));
  };

  const stopVoice = async () => {
    try {
      setIsPlayingVoice(false);
      
      if (Platform.OS === 'web') {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
          audioElementRef.current = null;
        }
      } else {
        if (soundObjectRef.current) {
          await soundObjectRef.current.stopAsync();
          await soundObjectRef.current.unloadAsync();
          soundObjectRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  };

  const playOmenVoice = async (text: string, personaVoiceStyle: string) => {
    if (!userPreferences.voiceEnabled) {
      return;
    }

    // Clear any previous errors
    setVoiceError(null);

    // Stop any currently playing audio
    await stopVoice();

    try {
      setIsPlayingVoice(true);
      
      const voiceId = ELEVEN_LABS_VOICE_MAP[personaVoiceStyle];
      if (!voiceId) {
        console.warn(`No Eleven Labs voice ID found for persona voice style: ${personaVoiceStyle}`);
        setVoiceError('Voice configuration not found for this persona.');
        setIsPlayingVoice(false);
        return;
      }

      // Call the API route
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch audio from API route:', errorData);
        
        // Set user-friendly error message
        const userMessage = errorData.userMessage || 'Voice feature is currently unavailable.';
        setVoiceError(userMessage);
        
        // Update service availability status
        if (errorData.isServiceUnavailable) {
          setIsVoiceServiceAvailable(false);
        }
        
        setIsPlayingVoice(false);
        return;
      }

      const { audio: base64Audio } = await response.json();
      if (!base64Audio) {
        console.error('No audio data received from API route.');
        setVoiceError('No audio data received. Please try again.');
        setIsPlayingVoice(false);
        return;
      }

      // Reset service availability on successful response
      setIsVoiceServiceAvailable(true);

      // Platform-specific audio playback
      if (Platform.OS === 'web') {
        // Web implementation using HTML5 Audio
        const audioBlob = new Blob([
          Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlayingVoice(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsPlayingVoice(false);
          setVoiceError('Failed to play audio. Please try again.');
          URL.revokeObjectURL(audioUrl);
        };
        
        audioElementRef.current = audio;
        await audio.play();
      } else {
        // Mobile implementation using expo-av
        const { sound } = await Audio.Sound.createAsync(
          { uri: `data:audio/mpeg;base64,${base64Audio}` },
          { shouldPlay: true }
        );
        
        soundObjectRef.current = sound;
        
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlayingVoice(false);
          }
        });
        
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing omen voice:', error);
      setVoiceError('An unexpected error occurred while playing voice. Please try again.');
      setIsPlayingVoice(false);
    }
  };

  const addOmen = async (omen: WhimsicalOmen) => {
    const newHistory = [omen, ...omenHistory];
    setOmenHistory(newHistory);
    await AsyncStorage.setItem('omenHistory', JSON.stringify(newHistory));

    // Play voice narration if enabled and service is available
    if (userPreferences.voiceEnabled && isVoiceServiceAvailable) {
      const persona = ORACLE_PERSONAS.find(p => p.id === omen.persona);
      if (persona) {
        const fullText = `${omen.crypticPhrase}. ${omen.interpretation}. ${omen.advice}`;
        await playOmenVoice(fullText, persona.voiceStyle);
      }
    }
  };

  const rateOmen = async (omenId: string, rating: number) => {
    const updatedHistory = omenHistory.map(omen =>
      omen.id === omenId ? { ...omen, rating } : omen
    );
    setOmenHistory(updatedHistory);
    await AsyncStorage.setItem('omenHistory', JSON.stringify(updatedHistory));
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