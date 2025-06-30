import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SUPPORTED_LANGUAGES, 
  isRTL, 
  changeLanguage as changeAppLanguage,
  getCurrentLanguage,
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
  const { userProfile, updateLanguage: updateUserLanguage, syncUserData } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isRTLLayout, setIsRTLLayout] = useState(isRTL(getCurrentLanguage()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize language from user profile when available
    if (userProfile?.language && userProfile.language !== currentLanguage) {
      handleLanguageChange(userProfile.language, false); // Don't sync back to avoid loop
    }
  }, [userProfile?.language]);

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

  const handleLanguageChange = async (locale: string, syncToServer: boolean = true) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Change app language
      await changeAppLanguage(locale);
      setCurrentLanguage(locale);
      setIsRTLLayout(isRTL(locale));
      
      // Sync to Supabase if user is logged in and syncToServer is true
      if (syncToServer && userProfile) {
        await updateUserLanguage(locale);
        
        // Also sync as part of comprehensive user data
        await syncUserData({
          language: locale,
          preferences: {
            ...userProfile.preferences,
            language: locale,
          },
        });
      }
      
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
        changeLanguage: (locale: string) => handleLanguageChange(locale, true),
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