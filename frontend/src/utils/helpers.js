/**
 * Helper Utilities
 * 
 * Collection of utility functions used throughout the application.
 * Provides text formatting, validation, and other common operations.
 * 
 * @module utils/helpers
 */

import { UI_CONFIG } from '../constants/config';

/**
 * Generates a conversation title from the first message
 * Truncates to MAX_TITLE_LENGTH and adds ellipsis if needed
 * 
 * @function generateConversationTitle
 * @param {string} firstMessage - The first message content
 * @returns {string} Truncated title
 * 
 * @example
 * generateConversationTitle('This is a very long message...');
 * // Returns: 'This is a very long message...'
 */
export const generateConversationTitle = (firstMessage) => {
  if (!firstMessage || typeof firstMessage !== 'string') {
    return 'New Chat';
  }

  const trimmed = firstMessage.trim();
  const maxLength = UI_CONFIG.MAX_TITLE_LENGTH;
  
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  
  return trimmed.substring(0, maxLength) + '...';
};

/**
 * Formats a timestamp to a readable date string
 * 
 * @function formatDate
 * @param {string|Date} timestamp - ISO timestamp or Date object
 * @returns {string} Formatted date string
 * 
 * @example
 * formatDate('2024-01-01T12:00:00Z');
 * // Returns: '1/1/2024, 12:00:00 PM'
 */
export const formatDate = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Validates if a string is not empty after trimming
 * 
 * @function isValidMessage
 * @param {string} message - Message to validate
 * @returns {boolean} True if message is valid
 * 
 * @example
 * isValidMessage('  '); // Returns: false
 * isValidMessage('Hello'); // Returns: true
 */
export const isValidMessage = (message) => {
  return typeof message === 'string' && message.trim().length > 0;
};

/**
 * Generates a unique ID based on current timestamp
 * 
 * @function generateId
 * @returns {string} Unique ID string
 * 
 * @example
 * generateId(); // Returns: '1704099600000'
 */
export const generateId = () => {
  return Date.now().toString();
};

/**
 * Scrolls an element into view smoothly
 * 
 * @function scrollToBottom
 * @param {React.RefObject} ref - React ref to the element to scroll to
 * 
 * @example
 * const ref = useRef();
 * scrollToBottom(ref);
 */
export const scrollToBottom = (ref) => {
  ref.current?.scrollIntoView({ 
    behavior: UI_CONFIG.AUTO_SCROLL_BEHAVIOR 
  });
};

/**
 * Debounces a function call
 * 
 * @function debounce
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Checks if code is running in development mode
 * 
 * @function isDevelopment
 * @returns {boolean} True if in development mode
 * 
 * @example
 * if (isDevelopment()) {
 *   console.log('Running in development mode');
 * }
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};
