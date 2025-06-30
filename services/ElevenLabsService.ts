import { Platform } from 'react-native';

export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
}

export interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  available_for_tiers: string[];
}

// Check if ElevenLabs is available
const isElevenLabsAvailable = (): boolean => {
  try {
    // Check if we have the necessary environment variables
    const apiKey = getElevenLabsApiKey();
    return !!apiKey;
  } catch (error) {
    console.warn('ElevenLabs not available:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

const getElevenLabsApiKey = (): string => {
  // Try different ways to get the API key
  if (typeof process !== 'undefined' && process.env) {
    return process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';
  }
  
  // For web environments, try accessing via global
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';
  }
  
  return '';
};

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private isAvailable: boolean;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  // Oracle persona to ElevenLabs voice mappings
  private readonly voiceMappings: Record<string, VoiceConfig> = {
    'cosmic-sage': {
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - wise, deep voice
      stability: 0.75,
      similarityBoost: 0.8,
      style: 0.2,
      useSpeakerBoost: true,
    },
    'mystical-librarian': {
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - scholarly, clear voice
      stability: 0.8,
      similarityBoost: 0.75,
      style: 0.3,
      useSpeakerBoost: true,
    },
    'starlight-fairy': {
      voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - playful, light voice
      stability: 0.6,
      similarityBoost: 0.9,
      style: 0.4,
      useSpeakerBoost: true,
    },
    'crystal-prophet': {
      voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel - mysterious, deep voice
      stability: 0.7,
      similarityBoost: 0.85,
      style: 0.1,
      useSpeakerBoost: true,
    },
    'time-weaver': {
      voiceId: 'CYw3kZ02Hs0563khs1Fj', // Gigi - temporal, ethereal voice
      stability: 0.65,
      similarityBoost: 0.8,
      style: 0.25,
      useSpeakerBoost: true,
    },
  };

  constructor() {
    const apiKey = getElevenLabsApiKey();
    
    this.config = {
      apiKey,
      baseUrl: 'https://api.elevenlabs.io',
    };
    
    this.isAvailable = isElevenLabsAvailable();
    
    if (!this.isAvailable) {
      console.log('ElevenLabs service initialized but API key is not available');
    } else {
      console.log('ElevenLabs service initialized successfully');
    }
  }

  // Check if ElevenLabs is available
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  // Get voice configuration for a persona
  getVoiceConfig(personaId: string): VoiceConfig {
    return this.voiceMappings[personaId] || this.voiceMappings['cosmic-sage'];
  }

  // Generate speech using ElevenLabs API
  async generateSpeech(
    text: string,
    personaId: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.isAvailable) {
      // Fallback to native TTS
      return this.fallbackToNativeTTS(text, personaId, onStart, onEnd, onError);
    }

    try {
      onStart?.();
      this.isPlaying = true;

      const voiceConfig = this.getVoiceConfig(personaId);
      
      const response = await fetch(`${this.config.baseUrl}/v1/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarityBoost,
            style: voiceConfig.style || 0,
            use_speaker_boost: voiceConfig.useSpeakerBoost || true,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`ElevenLabs API error: ${errorData.detail?.message || errorData.error || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      if (Platform.OS === 'web') {
        await this.playWebAudio(audioUrl, onEnd, onError);
      } else {
        // For mobile, we'll need to use Expo AV
        await this.playMobileAudio(audioUrl, onEnd, onError);
      }

    } catch (error) {
      console.error('ElevenLabs speech generation failed:', error);
      this.isPlaying = false;
      
      // Fallback to native TTS
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('Falling back to native TTS due to error:', errorMessage);
      
      await this.fallbackToNativeTTS(text, personaId, onStart, onEnd, onError);
    }
  }

  // Play audio on web platform
  private async playWebAudio(
    audioUrl: string,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.isPlaying = false;
        onEnd?.();
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.onerror = (event) => {
        this.isPlaying = false;
        const errorMessage = 'Audio playback failed';
        onError?.(errorMessage);
        URL.revokeObjectURL(audioUrl);
        reject(new Error(errorMessage));
      };

      audio.oncanplaythrough = () => {
        audio.play().catch((playError) => {
          this.isPlaying = false;
          const errorMessage = `Audio play failed: ${playError.message}`;
          onError?.(errorMessage);
          URL.revokeObjectURL(audioUrl);
          reject(new Error(errorMessage));
        });
      };

      audio.load();
    });
  }

  // Play audio on mobile platform using Expo AV
  private async playMobileAudio(
    audioUrl: string,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      // For mobile platforms, we'd use Expo AV
      // This is a simplified implementation - in a real app you'd use expo-av
      console.log('Mobile audio playback not fully implemented - using fallback');
      throw new Error('Mobile audio playback requires expo-av implementation');
    } catch (error) {
      console.error('Mobile audio playback failed:', error);
      this.isPlaying = false;
      onError?.(error instanceof Error ? error.message : 'Mobile audio playback failed');
    }
  }

  // Fallback to native TTS
  private async fallbackToNativeTTS(
    text: string,
    personaId: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      onStart?.();
      this.isPlaying = true;

      // Get voice configuration for persona-specific settings
      const voiceConfig = this.getVoiceConfig(personaId);
      
      // Use native speech synthesis
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        return new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Apply persona-specific voice settings
          utterance.rate = this.mapStabilityToRate(voiceConfig.stability);
          utterance.pitch = this.mapSimilarityToPitch(voiceConfig.similarityBoost);
          utterance.volume = 0.9;
          
          // Try to find a suitable voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = this.selectVoiceForPersona(voices, personaId);
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          utterance.onstart = () => {
            console.log('Native TTS started');
          };

          utterance.onend = () => {
            this.isPlaying = false;
            onEnd?.();
            resolve();
          };

          utterance.onerror = (event) => {
            this.isPlaying = false;
            const errorMessage = `Speech synthesis error: ${event.error}`;
            onError?.(errorMessage);
            reject(new Error(errorMessage));
          };

          // Cancel any existing speech and wait before starting new one
          window.speechSynthesis.cancel();
          
          // Add delay to allow browser to clear speech queue
          setTimeout(() => {
            window.speechSynthesis.speak(utterance);
          }, 100);
        });
      } else if (Platform.OS !== 'web') {
        // For mobile platforms, use expo-speech if available
        try {
          const { Speech } = require('expo-speech');
          
          const options = {
            rate: this.mapStabilityToRate(voiceConfig.stability),
            pitch: this.mapSimilarityToPitch(voiceConfig.similarityBoost),
            volume: 0.9,
            language: 'en-US',
            onDone: () => {
              this.isPlaying = false;
              onEnd?.();
            },
            onError: (error: any) => {
              this.isPlaying = false;
              onError?.(`Native speech error: ${error}`);
            },
          };

          await Speech.speak(text, options);
        } catch (speechError) {
          this.isPlaying = false;
          onError?.('Native speech synthesis not available');
        }
      } else {
        this.isPlaying = false;
        onError?.('No speech synthesis available');
      }
    } catch (error) {
      this.isPlaying = false;
      onError?.(error instanceof Error ? error.message : 'TTS fallback failed');
    }
  }

  // Map ElevenLabs stability to speech rate
  private mapStabilityToRate(stability: number): number {
    // Higher stability = slower, more deliberate speech
    return 0.6 + (1 - stability) * 0.6; // Range: 0.6 to 1.2
  }

  // Map ElevenLabs similarity boost to pitch
  private mapSimilarityToPitch(similarityBoost: number): number {
    // Higher similarity boost = slightly higher pitch for clarity
    return 0.8 + similarityBoost * 0.4; // Range: 0.8 to 1.2
  }

  // Select appropriate voice for persona
  private selectVoiceForPersona(voices: SpeechSynthesisVoice[], personaId: string): SpeechSynthesisVoice | null {
    const voicePreferences: Record<string, string[]> = {
      'cosmic-sage': ['male', 'deep', 'alex', 'daniel'],
      'mystical-librarian': ['female', 'clear', 'samantha', 'victoria'],
      'starlight-fairy': ['female', 'light', 'karen', 'tessa'],
      'crystal-prophet': ['male', 'mysterious', 'fred', 'jorge'],
      'time-weaver': ['female', 'ethereal', 'allison', 'ava'],
    };

    const preferences = voicePreferences[personaId] || [];
    
    // Try to find a voice that matches preferences
    for (const preference of preferences) {
      const matchingVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(preference.toLowerCase())
      );
      if (matchingVoice) {
        return matchingVoice;
      }
    }

    // Fallback to default voice
    return voices.find(voice => voice.default) || voices[0] || null;
  }

  // Stop current speech
  async stopSpeech(): Promise<void> {
    try {
      this.isPlaying = false;

      // Stop web audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      // Stop web speech synthesis
      if (Platform.OS === 'web' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      // Stop mobile speech
      if (Platform.OS !== 'web') {
        try {
          const { Speech } = require('expo-speech');
          await Speech.stop();
        } catch (error) {
          // Speech module not available
        }
      }
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  // Check if currently playing
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Get available voices (for admin/debug purposes)
  async getAvailableVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.isAvailable) {
      return [];
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  }
}

// Singleton instance
let elevenLabsService: ElevenLabsService | null = null;

export const getElevenLabsService = (): ElevenLabsService => {
  if (!elevenLabsService) {
    elevenLabsService = new ElevenLabsService();
  }
  return elevenLabsService;
};