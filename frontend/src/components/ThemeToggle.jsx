/**
 * ThemeToggle Component
 * 
 * Button component for switching between light and dark themes.
 * Displays sun icon for light theme and moon icon for dark theme.
 * Includes smooth transition animation when toggling.
 * 
 * @module components/ThemeToggle
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Theme toggle button component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isDark - Whether dark theme is currently active
 * @param {Function} props.onToggle - Callback function when theme is toggled
 * @param {string} props.className - Additional CSS classes
 * 
 * @example
 * <ThemeToggle
 *   isDark={isDark}
 *   onToggle={toggleTheme}
 * />
 */
const ThemeToggle = ({ isDark, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`theme-toggle p-2.5 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <div className="relative w-6 h-6">
        {isDark ? (
          <Moon 
            size={22} 
            className="absolute inset-0 text-gray-400 animate-fade-in" 
          />
        ) : (
          <Sun 
            size={22} 
            className="absolute inset-0 text-gray-700 animate-fade-in" 
          />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
