import { LingoSDK } from '@lingo.dev/sdk';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';

// Initialize Lingo.dev SDK
const lingo = new LingoSDK({
  apiKey: process.env.EXPO_PUBLIC_LINGO_API_KEY || '',
  projectId: process.env.EXPO_PUBLIC_LINGO_PROJECT_ID || '',
  environment: __DEV__ ? 'development' : 'production',
});

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

// RTL languages
export const RTL_LANGUAGES = ['ar'];

// Helper function to check if language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};

// Detect device locale
const getDeviceLocale = (): string => {
  try {
    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode || 'en';
    
    // Check if we support this language
    const supportedLanguages = SUPPORTED_LANGUAGES.map(lang => lang.code);
    return supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';
  } catch (error) {
    console.warn('Failed to get device locale:', error);
    return 'en';
  }
};

// Storage helpers
const LANGUAGE_STORAGE_KEY = 'whimsical-oracle-language';

export const getStoredLanguage = (): string | null => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  }
  // For mobile, you would use AsyncStorage here
  return null;
};

export const setStoredLanguage = (locale: string): void => {
  if (Platform.OS === 'web') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  }
  // For mobile, you would use AsyncStorage here
};

// Translation cache
let translationCache: Map<string, Map<string, string>> = new Map();

// Initialize Lingo.dev service
class LingoService {
  private currentLocale: string;
  private isInitialized: boolean = false;

  constructor() {
    this.currentLocale = getStoredLanguage() || getDeviceLocale();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize Lingo.dev SDK
      await lingo.init();
      
      // Load translations for current locale
      await this.loadTranslations(this.currentLocale);
      
      this.isInitialized = true;
      console.log('Lingo.dev service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Lingo.dev service:', error);
      this.isInitialized = false;
    }
  }

  async loadTranslations(locale: string): Promise<void> {
    try {
      // Check if translations are already cached
      if (translationCache.has(locale)) {
        return;
      }

      // Fetch translations from Lingo.dev
      const translations = await lingo.getTranslations(locale);
      
      // Cache the translations
      const localeCache = new Map<string, string>();
      Object.entries(translations).forEach(([key, value]) => {
        localeCache.set(key, value as string);
      });
      
      translationCache.set(locale, localeCache);
      console.log(`Loaded translations for locale: ${locale}`);
    } catch (error) {
      console.error(`Failed to load translations for locale ${locale}:`, error);
      
      // Fallback to English if available
      if (locale !== 'en' && !translationCache.has('en')) {
        try {
          await this.loadTranslations('en');
        } catch (fallbackError) {
          console.error('Failed to load fallback English translations:', fallbackError);
        }
      }
    }
  }

  async changeLanguage(locale: string): Promise<void> {
    try {
      // Load translations for the new locale if not cached
      if (!translationCache.has(locale)) {
        await this.loadTranslations(locale);
      }

      this.currentLocale = locale;
      setStoredLanguage(locale);
      
      console.log(`Language changed to: ${locale}`);
    } catch (error) {
      console.error(`Failed to change language to ${locale}:`, error);
    }
  }

  translate(key: string, params?: Record<string, any>): string {
    if (!this.isInitialized) {
      return key; // Return key as fallback if not initialized
    }

    // Get translation from cache
    const localeCache = translationCache.get(this.currentLocale);
    let translation = localeCache?.get(key);

    // Fallback to English if translation not found
    if (!translation && this.currentLocale !== 'en') {
      const englishCache = translationCache.get('en');
      translation = englishCache?.get(key);
    }

    // Fallback to key if no translation found
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation!.replace(
          new RegExp(`{{${paramKey}}}`, 'g'),
          String(paramValue)
        );
      });
    }

    return translation;
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  isRTL(): boolean {
    return isRTL(this.currentLocale);
  }
}

// Create singleton instance
export const lingoService = new LingoService();

// Export convenience functions
export const t = (key: string, params?: Record<string, any>): string => {
  return lingoService.translate(key, params);
};

export const getCurrentLanguage = (): string => {
  return lingoService.getCurrentLocale();
};

export const changeLanguage = async (locale: string): Promise<void> => {
  await lingoService.changeLanguage(locale);
};

export const initializeI18n = async (): Promise<void> => {
  await lingoService.initialize();
};

export { lingo, lingoService as default };