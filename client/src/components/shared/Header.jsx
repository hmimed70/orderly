import { HiMenu } from "react-icons/hi";
import { GiSun, GiMoon } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useTranslation } from "react-i18next";

import PropTypes from 'prop-types';
import { useLanguage } from "../../hooks/LanguageProvider";

import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useUser";

const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();

  const { logout, isLoading } = useLogout();
  const { theme, toggleTheme } = useTheme();
  const { changeLanguage } = useLanguage();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Refs to track dropdown elements
  const accountDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Toggle account dropdown visibility
  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen((prev) => !prev);
  };

  // Toggle language dropdown visibility
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen((prev) => !prev);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false); // Close language dropdown after selection
  };

  const logoutUser = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Close dropdowns if click happens outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current && !accountDropdownRef.current.contains(event.target) &&
        languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 z-10 left-0 lg:ltr:left-[70px] lg:rtl:right-[70px] mx-1 right-0 flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-lg text-black dark:text-white">
       <div></div>
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
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={toggleLanguageDropdown}
            className="flex items-center gap-2 font-medium"
          >
            {t('language')}
          </button>
          {isLanguageDropdownOpen && (
            <ul onMouseLeave={toggleLanguageDropdown} className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 w-40">
              <li>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("fr")}
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Français
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className="block px-4 py-2 text-sm text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  العربية
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Account dropdown */}
        <div className="relative rtl:ml-28" ref={accountDropdownRef}>
          <button
            onClick={toggleAccountDropdown}
            className="flex items-center gap-2 font-medium"
          >
            <MdAccountCircle className="text-3xl" />
          </button>
          {isAccountDropdownOpen && (
            <ul onMouseLeave={toggleAccountDropdown} className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-md py-2 w-40">
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
      <button onClick={toggleSidebar} className="lg:hidden rtl:ml-2 ">
        <HiMenu className="text-3xl" />
      </button>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
