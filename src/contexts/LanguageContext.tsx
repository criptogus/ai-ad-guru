
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as translations from '@/locales';

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const defaultLanguage = 'en';

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  changeLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || defaultLanguage;
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (lang: string) => {
    if (translations[lang as keyof typeof translations]) {
      setCurrentLanguage(lang);
    } else {
      console.warn(`Language ${lang} not supported. Falling back to ${defaultLanguage}`);
      setCurrentLanguage(defaultLanguage);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let translation: any = translations[currentLanguage as keyof typeof translations];
    
    // Traverse the nested object
    for (const k of keys) {
      if (!translation[k]) {
        // If translation not found, try English, then return the key itself
        const enTranslation = getEnglishTranslation(key);
        return enTranslation || key;
      }
      translation = translation[k];
    }
    
    // Replace parameters if provided
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce(
        (str, [param, value]) => str.replace(`{{${param}}}`, value),
        translation
      );
    }
    
    return translation || key;
  };

  // Helper to get English translation as fallback
  const getEnglishTranslation = (key: string): string | null => {
    const keys = key.split('.');
    let enTranslation: any = translations.en;
    
    for (const k of keys) {
      if (!enTranslation[k]) {
        return null;
      }
      enTranslation = enTranslation[k];
    }
    
    return typeof enTranslation === 'string' ? enTranslation : null;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
