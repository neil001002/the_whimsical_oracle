declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_ELEVEN_LABS_API_KEY: string;
      EXPO_PUBLIC_LIVEKIT_URL: string;
      EXPO_PUBLIC_LIVEKIT_API_KEY: string;
      EXPO_PUBLIC_LIVEKIT_API_SECRET: string;
      LIVEKIT_URL: string;
      LIVEKIT_API_KEY: string;
      LIVEKIT_API_SECRET: string;
    }
  }
}

// Ensure this file is treated as a module
export {};