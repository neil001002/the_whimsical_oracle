declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      EXPO_PUBLIC_REVENUECAT_API_KEY: string;
      EXPO_PUBLIC_TAVUS_API_KEY: string;
      TAVUS_API_KEY: string;
      EXPO_PUBLIC_ELEVENLABS_API_KEY: string;
      EXPO_PUBLIC_LINGO_API_KEY: string;
      EXPO_PUBLIC_LINGO_PROJECT_ID: string;
    }
  }
}

// Ensure this file is treated as a module
export {};