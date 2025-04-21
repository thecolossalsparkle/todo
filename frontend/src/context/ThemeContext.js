import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Fixed light theme
  useEffect(() => {
    // Ensure light theme is always applied
    document.documentElement.setAttribute('data-theme', 'light');
    // Clear any existing theme preferences
    localStorage.removeItem('theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 