import { HiMenu } from "react-icons/hi";
import { GiSun, GiMoon } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {  MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";

import PropTypes from 'prop-types';
import { useLanguage } from "../../hooks/LanguageProvider";

import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useUSer";
const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();


  const { logout, isLoading } = useLogout();
  const { theme, toggleTheme } = useTheme();
  const { changeLanguage } = useLanguage();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // State for language dropdown
  const navigate = useNavigate();

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen((prev) => !prev);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen((prev) => !prev); // Toggle language dropdown visibility
  };
const handleLanguageChangge = (lang) => {
  changeLanguage(lang);
  toggleLanguageDropdown();
}
  const logoutUser = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 lg:ltr:left-64 lg:rtl:right-64 mx-1 right-0 flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-lg text-black dark:text-white">
      <h1 className="text-xl font-bold">{t('header')}</h1>
      <div className="flex items-center gap-8">
        {/* Theme toggle button */}
        <button onClick={toggleTheme}>
          {theme === "dark" ? (
            <GiSun className="text-xl" />
          ) : (
            <GiMoon className="text-xl" />
          )}
        </button>

        {/* Language dropdown */}
        <div className="relative">
          <button
            onClick={toggleLanguageDropdown}
            className="flex items-center gap-2 font-medium"
          >
            {t('language')}
          </button>
          {isLanguageDropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 w-40">
              <li>
                <button
                  onClick={() => handleLanguageChangge("en")}
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChangge("fr")}
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Français
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLanguageChangge("ar")}
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  العربية
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Account dropdown */}
        <div className="relative rtl:ml-28">
          <button
            onClick={toggleAccountDropdown}
            className="flex items-center gap-2 font-medium"
          >
            <MdAccountCircle className="text-3xl" />
          </button>
          {isAccountDropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 w-40">
              <li>
                <NavLink
                  to="/account/update-profile"
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {t('updateProfile')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/account/update-password"
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {t('updatePassword')}
                </NavLink>
              </li>
              <NavLink>
                <button
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={logoutUser}
                  disabled={isLoading}
                >
                  {t('logout')}
                </button>
              </NavLink>
            </ul>
          )}
        </div>
      </div>

      {/* Sidebar toggle button */}
      <button onClick={toggleSidebar} className="lg:hidden">
        <HiMenu className="text-3xl" />
      </button>
    </header>
  );
};
Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
}
export default Header;
