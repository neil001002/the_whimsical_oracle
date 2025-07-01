import { AudioPlayer, AudioPlayerCallbacks } from './audio-player';

export class WebAudioPlayer implements AudioPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private isCurrentlyPlaying: boolean = false;
  private callbacks?: AudioPlayerCallbacks;

  constructor(callbacks?: AudioPlayerCallbacks) {
    this.callbacks = callbacks;
  }

  async play(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      this.stop();

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onloadstart = () => {
        console.log('🎵 Web audio loading started');
      };

      audio.oncanplay = () => {
        console.log('🎵 Web audio can start playing');
      };

      audio.onplay = () => {
        console.log('🎵 Web audio playback started');
        this.isCurrentlyPlaying = true;
        this.callbacks?.onStart?.();
      };

      audio.onended = () => {
        console.log('🎵 Web audio playback ended');
        this.isCurrentlyPlaying = false;
        this.callbacks?.onEnd?.();
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (event) => {
        console.error('🎵 Web audio playback error:', event);
        this.isCurrentlyPlaying = false;
        const errorMessage = 'Audio playback failed';
        this.callbacks?.onError?.(errorMessage);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(new Error(errorMessage));
      };

      // Set audio properties
      audio.volume = 0.9;
      audio.preload = 'auto';

      // Start playing
      audio.play().catch((playError) => {
        console.error('🎵 Web audio play failed:', playError);
        this.isCurrentlyPlaying = false;
        const errorMessage = `Audio play failed: ${playError.message}`;
        this.callbacks?.onError?.(errorMessage);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        reject(new Error(errorMessage));
      });
    });
  }

  async stop(): Promise<void> {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.isCurrentlyPlaying = false;
      console.log('🎵 Web audio stopped');
    }
  }

  isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }
}