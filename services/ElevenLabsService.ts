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
    const apiKey = getElevenLabsApiKey();
    return !!apiKey && apiKey.length > 10; // Basic validation
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

  // Oracle persona to ElevenLabs voice mappings with verified working voice IDs
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
    
    console.log('ElevenLabs Service Status:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey.length,
      isAvailable: this.isAvailable,
      nativeTTSAvailable: this.isNativeTTSAvailable(),
    });
  }

  // Check if ElevenLabs is available
  isServiceAvailable(): boolean {
    // Always return true since we have fallback TTS
    return true;
  }

  // Check if native TTS is available as fallback
  private isNativeTTSAvailable(): boolean {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }
    
    // For mobile platforms, check if expo-speech is available
    try {
      require('expo-speech');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get voice configuration for a persona
  getVoiceConfig(personaId: string): VoiceConfig {
    return this.voiceMappings[personaId] || this.voiceMappings['cosmic-sage'];
  }

  // Generate speech using ElevenLabs API or fallback to native TTS
  async generateSpeech(
    text: string,
    personaId: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    console.log('🎵 Generating speech:', {
      personaId,
      textLength: text.length,
      hasElevenLabs: this.isAvailable,
      hasNativeTTS: this.isNativeTTSAvailable(),
    });

    // Stop any currently playing audio first
    await this.stopSpeech();

    // Try ElevenLabs first if available
    if (this.isAvailable && this.config.apiKey) {
      try {
        console.log('🎵 Attempting ElevenLabs speech generation...');
        await this.generateElevenLabsSpeech(text, personaId, onStart, onEnd, onError);
        return;
      } catch (error) {
        console.warn('🎵 ElevenLabs failed, falling back to native TTS:', error);
        // Continue to fallback
      }
    } else {
      console.log('🎵 ElevenLabs not available, using native TTS');
    }

    // Fallback to native TTS
    await this.fallbackToNativeTTS(text, personaId, onStart, onEnd, onError);
  }

  // Generate speech using ElevenLabs API
  private async generateElevenLabsSpeech(
    text: string,
    personaId: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      console.log('🎵 Using ElevenLabs API for speech generation');
      onStart?.();
      this.isPlaying = true;

      const voiceConfig = this.getVoiceConfig(personaId);
      console.log('🎵 Voice config:', voiceConfig);
      
      const requestBody = {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: voiceConfig.stability,
          similarity_boost: voiceConfig.similarityBoost,
          style: voiceConfig.style || 0,
          use_speaker_boost: voiceConfig.useSpeakerBoost || true,
        },
      };

      console.log('🎵 ElevenLabs request:', {
        url: `${this.config.baseUrl}/v1/text-to-speech/${voiceConfig.voiceId}`,
        body: requestBody,
      });
      
      const response = await fetch(`${this.config.baseUrl}/v1/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🎵 ElevenLabs response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 ElevenLabs API error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(`ElevenLabs API error (${response.status}): ${errorData.detail?.message || errorData.error || response.statusText}`);
      }

      const audioBlob = await response.blob();
      console.log('🎵 ElevenLabs audio blob size:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        throw new Error('ElevenLabs returned empty audio');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('🎵 ElevenLabs audio generated successfully, playing...');

      // Play audio
      await this.playWebAudio(audioUrl, onEnd, onError);

    } catch (error) {
      console.error('🎵 ElevenLabs speech generation failed:', error);
      this.isPlaying = false;
      throw error; // Re-throw to trigger fallback
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

      audio.onloadstart = () => {
        console.log('🎵 Audio loading started');
      };

      audio.oncanplay = () => {
        console.log('🎵 Audio can start playing');
      };

      audio.onplay = () => {
        console.log('🎵 Audio playback started');
      };

      audio.onended = () => {
        console.log('🎵 Audio playback ended');
        this.isPlaying = false;
        onEnd?.();
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (event) => {
        console.error('🎵 Audio playback error:', event);
        this.isPlaying = false;
        const errorMessage = 'Audio playback failed';
        onError?.(errorMessage);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(new Error(errorMessage));
      };

      // Set volume and preload
      audio.volume = 0.9;
      audio.preload = 'auto';

      // Start playing
      audio.play().catch((playError) => {
        console.error('🎵 Audio play failed:', playError);
        this.isPlaying = false;
        const errorMessage = `Audio play failed: ${playError.message}`;
        onError?.(errorMessage);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(new Error(errorMessage));
      });
    });
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
      console.log('🎵 Using native TTS fallback for persona:', personaId);
      onStart?.();
      this.isPlaying = true;

      // Get voice configuration for persona-specific settings
      const voiceConfig = this.getVoiceConfig(personaId);
      
      // Use native speech synthesis
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        console.log('🎵 Using Web Speech API');
        
        return new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Apply persona-specific voice settings
          utterance.rate = this.mapStabilityToRate(voiceConfig.stability);
          utterance.pitch = this.mapSimilarityToPitch(voiceConfig.similarityBoost);
          utterance.volume = 0.9;
          
          // Try to find a suitable voice
          const voices = window.speechSynthesis.getVoices();
          console.log('🎵 Available voices:', voices.length);
          
          if (voices.length === 0) {
            // Voices not loaded yet, wait for them
            window.speechSynthesis.onvoiceschanged = () => {
              const newVoices = window.speechSynthesis.getVoices();
              console.log('🎵 Voices loaded:', newVoices.length);
              const preferredVoice = this.selectVoiceForPersona(newVoices, personaId);
              if (preferredVoice) {
                utterance.voice = preferredVoice;
                console.log('🎵 Selected voice:', preferredVoice.name);
              }
            };
          } else {
            const preferredVoice = this.selectVoiceForPersona(voices, personaId);
            if (preferredVoice) {
              utterance.voice = preferredVoice;
              console.log('🎵 Selected voice:', preferredVoice.name);
            }
          }

          utterance.onstart = () => {
            console.log('🎵 Native TTS started');
          };

          utterance.onend = () => {
            console.log('🎵 Native TTS ended');
            this.isPlaying = false;
            onEnd?.();
            resolve();
          };

          utterance.onerror = (event) => {
            console.error('🎵 Native TTS error:', event.error);
            this.isPlaying = false;
            const errorMessage = `Speech synthesis error: ${event.error}`;
            onError?.(errorMessage);
            reject(new Error(errorMessage));
          };

          // Cancel any existing speech and wait before starting new one
          window.speechSynthesis.cancel();
          
          // Add delay to allow browser to clear speech queue
          setTimeout(() => {
            try {
              window.speechSynthesis.speak(utterance);
              console.log('🎵 Native TTS utterance queued');
            } catch (speakError) {
              console.error('🎵 Failed to queue TTS utterance:', speakError);
              this.isPlaying = false;
              onError?.('Failed to start speech synthesis');
              reject(new Error('Failed to start speech synthesis'));
            }
          }, 100);
        });
      } else if (Platform.OS !== 'web') {
        // For mobile platforms, use expo-speech if available
        console.log('🎵 Using Expo Speech API');
        try {
          const { Speech } = require('expo-speech');
          
          const options = {
            rate: this.mapStabilityToRate(voiceConfig.stability),
            pitch: this.mapSimilarityToPitch(voiceConfig.similarityBoost),
            volume: 0.9,
            language: 'en-US',
            onDone: () => {
              console.log('🎵 Expo Speech completed');
              this.isPlaying = false;
              onEnd?.();
            },
            onError: (error: any) => {
              console.error('🎵 Expo Speech error:', error);
              this.isPlaying = false;
              onError?.(`Native speech error: ${error}`);
            },
          };

          console.log('🎵 Starting Expo Speech with options:', options);
          await Speech.speak(text, options);
        } catch (speechError) {
          console.error('🎵 Expo Speech not available:', speechError);
          this.isPlaying = false;
          onError?.('Native speech synthesis not available on this platform');
        }
      } else {
        this.isPlaying = false;
        onError?.('No speech synthesis available on this platform');
      }
    } catch (error) {
      console.error('🎵 TTS fallback failed:', error);
      this.isPlaying = false;
      onError?.(error instanceof Error ? error.message : 'TTS fallback failed');
    }
  }

  // Map ElevenLabs stability to speech rate
  private mapStabilityToRate(stability: number): number {
    // Higher stability = slower, more deliberate speech
    return 0.7 + (1 - stability) * 0.5; // Range: 0.7 to 1.2
  }

  // Map ElevenLabs similarity boost to pitch
  private mapSimilarityToPitch(similarityBoost: number): number {
    // Higher similarity boost = slightly higher pitch for clarity
    return 0.9 + similarityBoost * 0.2; // Range: 0.9 to 1.1
  }

  // Select appropriate voice for persona
  private selectVoiceForPersona(voices: SpeechSynthesisVoice[], personaId: string): SpeechSynthesisVoice | null {
    const voicePreferences: Record<string, string[]> = {
      'cosmic-sage': ['male', 'deep', 'alex', 'daniel', 'fred'],
      'mystical-librarian': ['female', 'clear', 'samantha', 'victoria', 'karen'],
      'starlight-fairy': ['female', 'light', 'karen', 'tessa', 'princess'],
      'crystal-prophet': ['male', 'mysterious', 'fred', 'jorge', 'alex'],
      'time-weaver': ['female', 'ethereal', 'allison', 'ava', 'zoe'],
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

    // Fallback: try to get a gender-appropriate voice
    const genderPreference = voicePreferences[personaId]?.[0];
    if (genderPreference === 'female') {
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('victoria')
      );
      if (femaleVoice) return femaleVoice;
    } else if (genderPreference === 'male') {
      const maleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('daniel') ||
        voice.name.toLowerCase().includes('fred')
      );
      if (maleVoice) return maleVoice;
    }

    // Final fallback to default voice
    return voices.find(voice => voice.default) || voices[0] || null;
  }

  // Stop current speech
  async stopSpeech(): Promise<void> {
    try {
      console.log('🎵 Stopping speech...');
      this.isPlaying = false;

      // Stop web audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
        console.log('🎵 Web audio stopped');
      }

      // Stop web speech synthesis
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        console.log('🎵 Web speech synthesis cancelled');
      }

      // Stop mobile speech
      if (Platform.OS !== 'web') {
        try {
          const { Speech } = require('expo-speech');
          await Speech.stop();
          console.log('🎵 Expo Speech stopped');
        } catch (error) {
          // Speech module not available
          console.log('🎵 Expo Speech not available for stopping');
        }
      }
    } catch (error) {
      console.error('🎵 Error stopping speech:', error);
    }
  }

  // Check if currently playing
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Get available voices (for admin/debug purposes)
  async getAvailableVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.isAvailable) {
      console.log('🎵 ElevenLabs not available for voice listing');
      return [];
    }

    try {
      console.log('🎵 Fetching ElevenLabs voices...');
      const response = await fetch(`${this.config.baseUrl}/v1/voices`, {
        headers: {
          'xi-api-key': this.config.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🎵 ElevenLabs voices fetched:', data.voices?.length || 0);
      return data.voices || [];
    } catch (error) {
      console.error('🎵 Error fetching ElevenLabs voices:', error);
      return [];
    }
  }

  // Test voice functionality with comprehensive testing
  async testVoice(personaId: string = 'cosmic-sage'): Promise<boolean> {
    return new Promise((resolve) => {
      const testText = "Greetings, seeker. This is a test of the mystical voice system. The cosmic energies flow through digital realms.";
      
      console.log('🎵 Starting voice test for persona:', personaId);
      
      let testCompleted = false;
      const timeout = setTimeout(() => {
        if (!testCompleted) {
          console.log('🎵 Voice test timed out');
          testCompleted = true;
          resolve(false);
        }
      }, 15000); // 15 second timeout
      
      this.generateSpeech(
        testText,
        personaId,
        () => {
          console.log('🎵 Voice test started successfully');
        },
        () => {
          console.log('🎵 Voice test completed successfully');
          if (!testCompleted) {
            testCompleted = true;
            clearTimeout(timeout);
            resolve(true);
          }
        },
        (error) => {
          console.error('🎵 Voice test failed:', error);
          if (!testCompleted) {
            testCompleted = true;
            clearTimeout(timeout);
            resolve(false);
          }
        }
      );
    });
  }

  // Get service status for debugging
  getServiceStatus(): {
    elevenLabsAvailable: boolean;
    nativeTTSAvailable: boolean;
    hasApiKey: boolean;
    isPlaying: boolean;
    platform: string;
  } {
    return {
      elevenLabsAvailable: this.isAvailable,
      nativeTTSAvailable: this.isNativeTTSAvailable(),
      hasApiKey: !!this.config.apiKey,
      isPlaying: this.isPlaying,
      platform: Platform.OS,
    };
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