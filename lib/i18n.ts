import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { Platform } from 'react-native';

// Import translation files
import en from '@/locales/en/common.json';
import es from '@/locales/es/common.json';
import fr from '@/locales/fr/common.json';
import de from '@/locales/de/common.json';
import it from '@/locales/it/common.json';
import pt from '@/locales/pt/common.json';
import ja from '@/locales/ja/common.json';
import ko from '@/locales/ko/common.json';
import zh from '@/locales/zh/common.json';
import ar from '@/locales/ar/common.json';
import hi from '@/locales/hi/common.json';
import ru from '@/locales/ru/common.json';

const resources = {
  en: { common: en },
  es: { common: es },
  fr: { common: fr },
  de: { common: de },
  it: { common: it },
  pt: { common: pt },
  ja: { common: ja },
  ko: { common: ko },
  zh: { common: zh },
  ar: { common: ar },
  hi: { common: hi },
  ru: { common: ru },
};

// Language detection configuration
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: (callback: (lng: string) => void) => {
    // For mobile platforms, use device locale
    if (Platform.OS !== 'web') {
      try {
        const { getLocales } = require('expo-localization');
        const locales = getLocales();
        const deviceLanguage = locales[0]?.languageCode || 'en';
        callback(deviceLanguage);
      } catch (error) {
        console.warn('Failed to get device locale:', error);
        callback('en');
      }
    } else {
      // For web, use browser language
      const browserLanguage = navigator.language.split('-')[0] || 'en';
      callback(browserLanguage);
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React i18next options
    react: {
      useSuspense: false,
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// Export supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

// RTL languages
export const RTL_LANGUAGES = ['ar'];

// Helper function to check if language is RTL
export const isRTL = (languageCode: string): boolean => {
  return RTL_LANGUAGES.includes(languageCode);
};