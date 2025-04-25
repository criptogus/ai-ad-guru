
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { en, es, pt } from '@/locales';

// Define the language types
type Language = 'en' | 'es' | 'pt';
type TranslationDictionary = Record<string, string>;

// Define the language context type
interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: TranslationDictionary;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: () => {},
  t: (key) => key,
  translations: {}
});

// Create the provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect browser language and set initial state
  const detectBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') return 'pt';
    if (browserLang === 'es') return 'es';
    return 'en'; // Default to English
  };

  // Initialize with localStorage or browser language
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('preferredLanguage') as Language | null;
      return storedLang || detectBrowserLanguage();
    }
    return 'en'; // Default to English for SSR
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage());
  
  // Memoize translations for performance
  const translations = useMemo(() => {
    console.log("Computing translations for:", currentLanguage);
    return currentLanguage === 'es' ? es :
           currentLanguage === 'pt' ? pt : en;
  }, [currentLanguage]);

  // Update document and localStorage when language changes
  useEffect(() => {
    console.log("Language changed effect triggered:", currentLanguage);
    
    // Only attempt to access localStorage in browser environment
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('preferredLanguage', currentLanguage);
      // Update html lang attribute
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  // Change language function
  const changeLanguage = (lang: Language) => {
    console.log("Changing language to:", lang);
    setCurrentLanguage(lang);
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key];
  };

  // Memoize context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    t,
    translations
  }), [currentLanguage, translations]);

  // Provide the context
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook for using this context
export const useLanguage = () => useContext(LanguageContext);
