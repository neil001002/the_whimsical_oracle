import { i18n } from '@lingui/core';
import { Platform } from 'react-native';
import * as Localization from 'expo-localization';

// Import compiled message catalogs
import { messages as enMessages } from '../src/locales/en/messages';
import { messages as esMessages } from '../src/locales/es/messages';
import { messages as frMessages } from '../src/locales/fr/messages';
import { messages as deMessages } from '../src/locales/de/messages';
import { messages as itMessages } from '../src/locales/it/messages';
import { messages as ptMessages } from '../src/locales/pt/messages';
import { messages as jaMessages } from '../src/locales/ja/messages';
import { messages as koMessages } from '../src/locales/ko/messages';
import { messages as zhMessages } from '../src/locales/zh/messages';
import { messages as arMessages } from '../src/locales/ar/messages';
import { messages as hiMessages } from '../src/locales/hi/messages';
import { messages as ruMessages } from '../src/locales/ru/messages';

// Load message catalogs
i18n.load({
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages,
  pt: ptMessages,
  ja: jaMessages,
  ko: koMessages,
  zh: zhMessages,
  ar: arMessages,
  hi: hiMessages,
  ru: ruMessages,
});

// Detect device locale
const getDeviceLocale = (): string => {
  try {
    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode || 'en';
    
    // Check if we support this language
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi', 'ru'];
    return supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';
  } catch (error) {
    console.warn('Failed to get device locale:', error);
    return 'en';
  }
};

// Initialize with device locale
const deviceLocale = getDeviceLocale();
i18n.activate(deviceLocale);

export { i18n };

// Export supported languages with Lingo.dev integration
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

// Language change function
export const changeLanguage = (locale: string) => {
  i18n.activate(locale);
  
  // Store preference for persistence
  if (Platform.OS === 'web') {
    localStorage.setItem('preferred-language', locale);
  }
  // For mobile, you might want to use AsyncStorage or SecureStore
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.locale;
};

// Get stored language preference
export const getStoredLanguage = (): string | null => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('preferred-language');
  }
  // For mobile, implement AsyncStorage retrieval
  return null;
};