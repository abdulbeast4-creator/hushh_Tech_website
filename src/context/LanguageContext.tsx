import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'fr' | 'zh' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('hushh_locale') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hushh_locale', lang);
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRtl, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage context call breached the active LanguageProvider boundary.');
  }
  return context;
};
