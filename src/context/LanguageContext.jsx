import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('kebron_language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kebron_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      toggleLanguage: () => {},
      t: (key) => translations.en?.[key] || key
    };
  }
  return context;
};
