import React, { createContext, useContext, useState, useEffect } from 'react';
import { ptPT } from './locales/pt-PT';
import { en } from './locales/en';
import { es } from './locales/es';

export type Language = 'pt-PT' | 'en' | 'es';

const dictionaries: Record<Language, Record<string, string>> = {
  'pt-PT': ptPT,
  en: en,
  es: es,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  formatDate: (dateStr: string) => string;
  formatNumber: (num: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLang?: Language }> = ({
  children,
  initialLang = 'pt-PT',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aesthetix_lang') as Language;
    return saved && dictionaries[saved] ? saved : initialLang;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aesthetix_lang', lang);
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = dictionaries[language] || ptPT;
    if (dict[key]) return dict[key];
    const fallbackDict = ptPT;
    if (fallbackDict[key]) return fallbackDict[key];
    return defaultText || key;
  };

  const formatCurrency = (amount: number, currencyCode = 'EUR'): string => {
    try {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)}€`;
    }
  };

  const formatDate = (dateStr: string): string => {
    return dateStr;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language).format(num);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatCurrency,
        formatDate,
        formatNumber,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
