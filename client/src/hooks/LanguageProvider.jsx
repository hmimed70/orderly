// LanguageContext.js
import  { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// Create the context
const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [direction, setDirection] = useState(i18n.language === 'ar' ? 'rtl' : 'ltr');

  // Update document direction whenever the language or direction changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  // Function to change language and direction
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang).then(() => {
      setLanguage(lang);
      setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    });
  };

  return (
    <LanguageContext.Provider value={{ language, direction, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired
}
// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
