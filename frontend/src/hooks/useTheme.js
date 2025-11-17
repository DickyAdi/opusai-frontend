/**
 * Theme Hook
 * 
 * Custom React hook for managing application theme state.
 * Handles theme switching between light and dark modes with persistence.
 * Applies theme changes to document root for CSS variable access.
 * 
 * @module hooks/useTheme
 */

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, THEME_CONFIG } from '../constants/config';

/**
 * Hook for managing application theme
 * Automatically applies theme to document element and persists selection
 * 
 * @function useTheme
 * @returns {Object} Theme state and controls
 * @returns {string} return.theme - Current theme identifier (light or dark)
 * @returns {Function} return.setTheme - Function to change theme
 * @returns {Function} return.toggleTheme - Function to toggle between themes
 * @returns {boolean} return.isDark - Whether current theme is dark
 * 
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 * console.log(isDark); // true if dark theme is active
 * toggleTheme(); // Switch to opposite theme
 */
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.THEME,
    THEME_CONFIG.LIGHT
  );

  /**
   * Apply theme to document root element
   * This allows CSS variables and classes to respond to theme changes
   */
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove(THEME_CONFIG.LIGHT, THEME_CONFIG.DARK);
    
    // Add current theme class
    root.classList.add(theme);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Toggle between light and dark themes
   * @function toggleTheme
   */
  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme === THEME_CONFIG.LIGHT 
        ? THEME_CONFIG.DARK 
        : THEME_CONFIG.LIGHT
    );
  };

  /**
   * Check if current theme is dark
   * @type {boolean}
   */
  const isDark = theme === THEME_CONFIG.DARK;

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  };
};

export default useTheme;
