import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  SUPPORTED_LANGUAGES, 
  isRTL, 
  changeLanguage as changeAppLanguage,
  getCurrentLanguage,
  setStoredLanguage
} from '@/lib/i18n';

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  changeLanguage: (locale: string) => Promise<void>;
  isRTL: boolean;
  t: (key: string, fallback?: string, params?: Record<string, any>) => string;
  isLoading: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t: i18nT, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isRTLLayout, setIsRTLLayout] = useState(isRTL(getCurrentLanguage()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      setIsRTLLayout(isRTL(lng));
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleLanguageChange = async (locale: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await changeAppLanguage(locale);
      setCurrentLanguage(locale);
      setIsRTLLayout(isRTL(locale));
      
      console.log(`Language changed to: ${locale}`);
    } catch (error) {
      console.error('Failed to change language:', error);
      setError('Failed to change language');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced translation function with fallback support
  const t = (key: string, fallback?: string, params?: Record<string, any>): string => {
    try {
      const translation = i18nT(key, params);
      // If translation equals the key, it means no translation was found
      if (translation === key && fallback) {
        return fallback;
      }
      return translation;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback || key;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        changeLanguage: handleLanguageChange,
        isRTL: isRTLLayout,
        t,
        isLoading,
        error,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}