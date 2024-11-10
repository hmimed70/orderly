import { useState, useEffect } from "react";

export function useTheme() {
  const getInitialTheme = () => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Apply the theme to the HTML root element
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Save theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
