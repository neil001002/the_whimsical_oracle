import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nProvider } from '@lingui/react';
import { i18n, changeLanguage, getCurrentLanguage, getStoredLanguage, SUPPORTED_LANGUAGES, isRTL } from '@/lib/i18n';

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  changeLanguage: (locale: string) => void;
  isRTL: boolean;
  t: (id: string, values?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isRTLLayout, setIsRTLLayout] = useState(isRTL(getCurrentLanguage()));

  useEffect(() => {
    // Check for stored language preference on mount
    const storedLanguage = getStoredLanguage();
    if (storedLanguage && storedLanguage !== currentLanguage) {
      handleLanguageChange(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (locale: string) => {
    changeLanguage(locale);
    setCurrentLanguage(locale);
    setIsRTLLayout(isRTL(locale));
  };

  // Translation helper function
  const t = (id: string, values?: Record<string, any>) => {
    return i18n._(id, values);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        changeLanguage: handleLanguageChange,
        isRTL: isRTLLayout,
        t,
      }}
    >
      <I18nProvider i18n={i18n}>
        {children}
      </I18nProvider>
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