import { Platform } from 'react-native';
import { AudioPlayer, AudioPlayerCallbacks } from './audio-player';

export class NativeAudioPlayer implements AudioPlayer {
  private currentSound: any = null;
  private isCurrentlyPlaying: boolean = false;
  private callbacks?: AudioPlayerCallbacks;

  constructor(callbacks?: AudioPlayerCallbacks) {
    this.callbacks = callbacks;
  }

  async play(audioUrl: string): Promise<void> {
    // Stop any currently playing audio
    await this.stop();

    try {
      // Import expo-av dynamically to avoid web platform issues
      const { Audio } = require('expo-av');
      
      console.log('🎵 Loading native audio from URL:', audioUrl);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { 
          shouldPlay: true,
          volume: 0.9,
        }
      );

      this.currentSound = sound;
      this.isCurrentlyPlaying = true;
      this.callbacks?.onStart?.();

      // Set up playback status listener
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            console.log('🎵 Native audio playback finished');
            this.isCurrentlyPlaying = false;
            this.callbacks?.onEnd?.();
            this.currentSound = null;
          }
        } else if (status.error) {
          console.error('🎵 Native audio playback error:', status.error);
          this.isCurrentlyPlaying = false;
          this.callbacks?.onError?.(status.error);
          this.currentSound = null;
        }
      });

      console.log('🎵 Native audio started playing');

    } catch (error) {
      console.error('🎵 Native audio play failed:', error);
      this.isCurrentlyPlaying = false;
      const errorMessage = `Native audio play failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.callbacks?.onError?.(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async stop(): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        console.log('🎵 Native audio stopped and unloaded');
      } catch (error) {
        console.error('🎵 Error stopping native audio:', error);
      }
      this.currentSound = null;
      this.isCurrentlyPlaying = false;
    }
  }

  isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }
}