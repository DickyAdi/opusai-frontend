/**
 * Local Storage Hook
 * 
 * Custom React hook for managing localStorage with automatic serialization/deserialization.
 * Provides a useState-like interface with persistence.
 * 
 * @module hooks/useLocalStorage
 */

import { useState, useEffect } from 'react';

/**
 * Hook for managing localStorage state
 * 
 * @function useLocalStorage
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist in localStorage
 * @returns {Array} A stateful value and a setter function (like useState)
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 * setTheme('light'); // Updates localStorage and state
 */
export const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Update both state and localStorage
   * @param {*} value - New value or function that returns new value
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function (like useState)
      // Use callback to get latest value to prevent race conditions
      setStoredValue((prevValue) => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        
        // Update localStorage immediately
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error writing to localStorage key "${key}":`, error);
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
