import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  lingoService, 
  t as translate, 
  getCurrentLanguage, 
  changeLanguage as changeAppLanguage, 
  initializeI18n,
  SUPPORTED_LANGUAGES,
  isRTL 
} from '@/lib/lingo';

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  changeLanguage: (locale: string) => Promise<void>;
  isRTL: boolean;
  t: (key: string, params?: Record<string, any>) => string;
  isLoading: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isRTLLayout, setIsRTLLayout] = useState(isRTL(getCurrentLanguage()));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLingo();
  }, []);

  const initializeLingo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await initializeI18n();
      
      const currentLang = getCurrentLanguage();
      setCurrentLanguage(currentLang);
      setIsRTLLayout(isRTL(currentLang));
      
      console.log('Lingo.dev initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Lingo.dev:', error);
      setError('Failed to initialize language service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (locale: string) => {
    try {
      setError(null);
      await changeAppLanguage(locale);
      setCurrentLanguage(locale);
      setIsRTLLayout(isRTL(locale));
    } catch (error) {
      console.error('Failed to change language:', error);
      setError('Failed to change language');
    }
  };

  // Translation helper function
  const t = (key: string, params?: Record<string, any>) => {
    return translate(key, params);
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