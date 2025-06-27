declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_ELEVEN_LABS_API_KEY: string;
    }
  }
}

// Ensure this file is treated as a module
export {};