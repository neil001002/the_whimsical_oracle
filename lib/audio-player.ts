// Platform-agnostic audio player interface
export interface AudioPlayer {
  play(audioUrl: string): Promise<void>;
  stop(): Promise<void>;
  isPlaying(): boolean;
}

export interface AudioPlayerCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Factory function to get the appropriate audio player for the current platform
export const createAudioPlayer = (callbacks?: AudioPlayerCallbacks): AudioPlayer => {
  // Platform-specific imports will be handled by the bundler
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Web platform
    const { WebAudioPlayer } = require('./audio-player.web');
    return new WebAudioPlayer(callbacks);
  } else {
    // Native platform
    const { NativeAudioPlayer } = require('./audio-player.native');
    return new NativeAudioPlayer(callbacks);
  }
};