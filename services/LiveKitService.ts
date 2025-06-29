import { Platform } from 'react-native';

// Check if WebRTC is available
const isWebRTCAvailable = (): boolean => {
  if (Platform.OS === 'web') {
    return false; // LiveKit voice chat not supported on web
  }
  
  try {
    // Check if we're in a custom development build
    const isCustomBuild = !__DEV__ || (typeof expo === 'undefined' || !expo?.modules?.ExpoGo);
    if (!isCustomBuild) {
      return false; // Not available in Expo Go
    }
    
    // Try to import LiveKit to check if it's available
    require('livekit-client');
    require('@livekit/react-native-webrtc');
    return true;
  } catch (error) {
    console.warn('LiveKit not available:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

export interface LiveKitConfig {
  url: string;
  apiKey: string;
  apiSecret: string;
}

export interface VoiceSession {
  roomName: string;
  participantName: string;
  room: any; // Use any to avoid import issues when LiveKit isn't available
  isConnected: boolean;
  isRecording: boolean;
  isPlaying: boolean;
}

export class LiveKitVoiceService {
  private config: LiveKitConfig;
  private currentSession: VoiceSession | null = null;
  private onAudioReceived?: (audioData: ArrayBuffer) => void;
  private onConnectionStateChanged?: (connected: boolean) => void;
  private onError?: (error: string) => void;
  private onSpeechStarted?: () => void;
  private onSpeechEnded?: () => void;
  private isAvailable: boolean;

  constructor(config: LiveKitConfig) {
    this.config = config;
    this.isAvailable = isWebRTCAvailable();
    
    if (!this.isAvailable) {
      console.log('LiveKit service initialized but WebRTC is not available');
    }
  }

  // Check if LiveKit is available
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  // Generate access token for LiveKit room - Updated for mobile
  private async generateAccessToken(roomName: string, participantName: string): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('LiveKit service is not available on this platform');
    }

    try {
      // For mobile APK builds, we need to generate the token client-side
      // since there's no server to handle API routes
      if (Platform.OS !== 'web') {
        // Import AccessToken for client-side token generation
        const { AccessToken } = require('livekit-server-sdk');
        
        const token = new AccessToken(this.config.apiKey, this.config.apiSecret, {
          identity: participantName,
          ttl: '1h', // Token valid for 1 hour
        });

        // Grant permissions
        token.addGrant({
          room: roomName,
          roomJoin: true,
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
        });

        const jwt = await token.toJwt();
        return jwt;
      }

      // For web, try to use the API route if available
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName,
          participantName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.userMessage || 'Failed to generate access token');
      }

      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error('Error generating access token:', error);
      
      // Fallback: Try client-side token generation for web as well
      if (Platform.OS === 'web') {
        try {
          const { AccessToken } = require('livekit-server-sdk');
          
          const token = new AccessToken(this.config.apiKey, this.config.apiSecret, {
            identity: participantName,
            ttl: '1h',
          });

          token.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
          });

          const jwt = await token.toJwt();
          return jwt;
        } catch (fallbackError) {
          console.error('Fallback token generation failed:', fallbackError);
          throw new Error('Failed to generate access token. Please check your LiveKit configuration.');
        }
      }
      
      throw error;
    }
  }

  // Connect to LiveKit room for voice session
  async connectToVoiceSession(roomName: string, participantName: string): Promise<VoiceSession> {
    if (!this.isAvailable) {
      throw new Error('LiveKit service is not available. Please use a custom development build to enable voice chat features.');
    }

    try {
      // Dynamically import LiveKit only when needed and available
      const { Room, RoomEvent, Track } = require('livekit-client');

      if (this.currentSession?.isConnected) {
        await this.disconnectVoiceSession();
      }

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000,
          },
        },
      });

      // Set up event listeners
      room.on(RoomEvent.Connected, () => {
        console.log('Connected to LiveKit room');
        if (this.currentSession) {
          this.currentSession.isConnected = true;
        }
        this.onConnectionStateChanged?.(true);
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit room');
        if (this.currentSession) {
          this.currentSession.isConnected = false;
        }
        this.onConnectionStateChanged?.(false);
      });

      room.on(RoomEvent.TrackSubscribed, (track: any) => {
        if (track.kind === Track.Kind.Audio) {
          console.log('Audio track subscribed');
          
          // Handle received audio for real-time processing
          if (this.onAudioReceived) {
            // Note: In a real implementation, you'd need to process the audio stream
            // This is a simplified example
            this.onAudioReceived(new ArrayBuffer(0));
          }
        }
      });

      room.on(RoomEvent.ConnectionQualityChanged, (quality: any, participant: any) => {
        console.log('Connection quality changed:', quality, participant?.identity);
      });

      // Generate access token and connect
      const token = await this.generateAccessToken(roomName, participantName);
      await room.connect(this.config.url, token);

      this.currentSession = {
        roomName,
        participantName,
        room,
        isConnected: true,
        isRecording: false,
        isPlaying: false,
      };

      return this.currentSession;
    } catch (error) {
      console.error('Error connecting to voice session:', error);
      this.onError?.(`Failed to connect to voice session: ${error}`);
      throw error;
    }
  }

  // Start recording audio
  async startRecording(): Promise<void> {
    if (!this.isAvailable) {
      throw new Error('LiveKit service is not available');
    }

    if (!this.currentSession?.isConnected) {
      throw new Error('Not connected to voice session');
    }

    try {
      await this.currentSession.room.localParticipant.enableCameraAndMicrophone();
      this.currentSession.isRecording = true;
      console.log('Started recording audio');
    } catch (error) {
      console.error('Error starting recording:', error);
      this.onError?.(`Failed to start recording: ${error}`);
      throw error;
    }
  }

  // Stop recording audio
  async stopRecording(): Promise<void> {
    if (!this.isAvailable || !this.currentSession?.isConnected) {
      return;
    }

    try {
      await this.currentSession.room.localParticipant.setMicrophoneEnabled(false);
      this.currentSession.isRecording = false;
      console.log('Stopped recording audio');
    } catch (error) {
      console.error('Error stopping recording:', error);
      this.onError?.(`Failed to stop recording: ${error}`);
    }
  }

  // Text-to-speech using native platform TTS
  async speakText(text: string, voiceConfig?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
    if (!this.isAvailable) {
      throw new Error('LiveKit service is not available');
    }

    try {
      this.onSpeechStarted?.();
      
      // For Android, use native TTS
      if (Platform.OS === 'android') {
        // Import expo-speech for Android TTS
        const { Speech } = require('expo-speech');
        
        const options = {
          rate: voiceConfig?.rate || 1.0,
          pitch: voiceConfig?.pitch || 1.0,
          volume: voiceConfig?.volume || 1.0,
          language: 'en-US',
          onDone: () => {
            this.onSpeechEnded?.();
          },
          onError: (error: any) => {
            console.error('Speech error:', error);
            this.onSpeechEnded?.();
            this.onError?.(`Speech synthesis error: ${error}`);
          },
        };

        await Speech.speak(text, options);
        return;
      }

      // For iOS, use native TTS
      if (Platform.OS === 'ios') {
        const { Speech } = require('expo-speech');
        
        const options = {
          rate: voiceConfig?.rate || 1.0,
          pitch: voiceConfig?.pitch || 1.0,
          volume: voiceConfig?.volume || 1.0,
          language: 'en-US',
          onDone: () => {
            this.onSpeechEnded?.();
          },
          onError: (error: any) => {
            console.error('Speech error:', error);
            this.onSpeechEnded?.();
            this.onError?.(`Speech synthesis error: ${error}`);
          },
        };

        await Speech.speak(text, options);
        return;
      }

      // For web platform, use Web Speech API
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return new Promise((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Apply voice configuration
          if (voiceConfig) {
            utterance.rate = voiceConfig.rate || 1;
            utterance.pitch = voiceConfig.pitch || 1;
            utterance.volume = voiceConfig.volume || 1;
          }

          utterance.onstart = () => {
            this.onSpeechStarted?.();
          };

          utterance.onend = () => {
            this.onSpeechEnded?.();
            resolve();
          };

          utterance.onerror = (event) => {
            this.onSpeechEnded?.();
            reject(new Error(`Speech synthesis error: ${event.error}`));
          };

          window.speechSynthesis.speak(utterance);
        });
      }

      throw new Error('Text-to-speech not supported on this platform');
      
    } catch (error) {
      console.error('Error speaking text:', error);
      this.onSpeechEnded?.();
      this.onError?.(`Failed to speak text: ${error}`);
      throw error;
    }
  }

  // Stop current speech
  async stopSpeaking(): Promise<void> {
    try {
      // Stop native speech on mobile platforms
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const { Speech } = require('expo-speech');
        await Speech.stop();
      }

      // Stop web speech
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      this.onSpeechEnded?.();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  // Disconnect from voice session
  async disconnectVoiceSession(): Promise<void> {
    if (this.currentSession) {
      try {
        await this.currentSession.room.disconnect();
        this.currentSession = null;
        console.log('Disconnected from voice session');
      } catch (error) {
        console.error('Error disconnecting from voice session:', error);
      }
    }
  }

  // Set event handlers
  setEventHandlers(handlers: {
    onAudioReceived?: (audioData: ArrayBuffer) => void;
    onConnectionStateChanged?: (connected: boolean) => void;
    onError?: (error: string) => void;
    onSpeechStarted?: () => void;
    onSpeechEnded?: () => void;
  }) {
    this.onAudioReceived = handlers.onAudioReceived;
    this.onConnectionStateChanged = handlers.onConnectionStateChanged;
    this.onError = handlers.onError;
    this.onSpeechStarted = handlers.onSpeechStarted;
    this.onSpeechEnded = handlers.onSpeechEnded;
  }

  // Get current session status
  getSessionStatus(): {
    isConnected: boolean;
    isRecording: boolean;
    isPlaying: boolean;
    roomName?: string;
    participantName?: string;
  } {
    return {
      isConnected: this.currentSession?.isConnected || false,
      isRecording: this.currentSession?.isRecording || false,
      isPlaying: this.currentSession?.isPlaying || false,
      roomName: this.currentSession?.roomName,
      participantName: this.currentSession?.participantName,
    };
  }
}

// Singleton instance
let liveKitService: LiveKitVoiceService | null = null;

export const getLiveKitService = (): LiveKitVoiceService => {
  if (!liveKitService) {
    // Get environment variables with proper fallbacks
    const getEnvVar = (key: string): string => {
      // Try different ways to access environment variables
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || '';
      }
      
      // For web environments, try accessing via global
      if (typeof window !== 'undefined' && (window as any).__ENV__) {
        return (window as any).__ENV__[key] || '';
      }
      
      return '';
    };

    const config: LiveKitConfig = {
      url: getEnvVar('EXPO_PUBLIC_LIVEKIT_URL') || 'wss://the-whimsical-oracle-3msghxp0.livekit.cloud',
      apiKey: getEnvVar('EXPO_PUBLIC_LIVEKIT_API_KEY') || 'APImw6vGP9GpLjp',
      apiSecret: getEnvVar('EXPO_PUBLIC_LIVEKIT_API_SECRET') || 'PZotZRIQC54e8Nvzy0oR2pH1uLEdBPcUtnUoMOMowHK',
    };

    if (!config.url || !config.apiKey || !config.apiSecret) {
      console.warn('LiveKit configuration is incomplete. Using fallback values.');
      // Use the provided values as fallbacks
      config.url = config.url || 'wss://the-whimsical-oracle-3msghxp0.livekit.cloud';
      config.apiKey = config.apiKey || 'APImw6vGP9GpLjp';
      config.apiSecret = config.apiSecret || 'PZotZRIQC54e8Nvzy0oR2pH1uLEdBPcUtnUoMOMowHK';
    }

    liveKitService = new LiveKitVoiceService(config);
  }

  return liveKitService;
};