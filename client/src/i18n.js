// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation JSON files
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector) // Automatically detect language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
    },
    fallbackLng: 'en', // Default language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
