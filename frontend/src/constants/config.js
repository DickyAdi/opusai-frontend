/**
 * Application Configuration
 * 
 * Centralized configuration file for application-wide constants.
 * Uses environment variables for flexibility across different environments.
 * 
 * @module constants/config
 */

/**
 * API Base URL - loaded from environment variable
 * Defaults to localhost:8000 if not specified
 * @constant {string}
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * API Endpoints
 * @constant {Object}
 */
export const API_ENDPOINTS = {
  MODELS: '/v1/models',
  CHAT_COMPLETIONS: '/v1/chat/completions',
};

/**
 * Application metadata
 * @constant {Object}
 */
export const APP_CONFIG = {
  NAME: process.env.REACT_APP_NAME || 'Chat AI',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
};

/**
 * LocalStorage keys
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  CONVERSATIONS: 'conversations',
  CURRENT_CONVERSATION_ID: 'currentConvId',
  SELECTED_MODEL: 'selectedModel',
  THEME: 'theme',
  SIDEBAR_VISIBLE: 'sidebarVisible',
};

/**
 * UI Configuration
 * @constant {Object}
 */
export const UI_CONFIG = {
  MAX_TITLE_LENGTH: 30,
  MAX_MESSAGE_HEIGHT: '200px',
  MIN_MESSAGE_HEIGHT: '44px',
  AUTO_SCROLL_BEHAVIOR: 'smooth',
  TRANSITION_DURATION: '300ms',
  SIDEBAR_WIDTH: '256px',
};

/**
 * Theme Configuration
 * Defines color schemes for light and dark themes
 * @constant {Object}
 */
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  COLORS: {
    light: {
      background: '#f9fafb',
      surface: '#ffffff',
      surfaceAlt: '#f3f4f6',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      primary: '#000000',
      primaryHover: '#1f2937',
      danger: '#ef4444',
    },
    dark: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceAlt: '#334155',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      danger: '#ef4444',
    },
  },
};
