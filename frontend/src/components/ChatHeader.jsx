/**
 * ChatHeader Component
 * 
 * Header section of the chat interface containing controls and model selector.
 * Includes sidebar toggle, model selector, and theme toggle.
 * 
 * @module components/ChatHeader
 */

import React from 'react';
import ModelSelector from './ModelSelector';
import ThemeToggle from './ThemeToggle';
import SidebarToggle from './SidebarToggle';

/**
 * Chat header component with controls
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.models - Array of available model objects
 * @param {string} props.selectedModel - ID of the currently selected model
 * @param {Function} props.onSelectModel - Callback when a model is selected
 * @param {boolean} props.isDark - Whether dark theme is active
 * @param {Function} props.onToggleTheme - Callback to toggle theme
 * @param {boolean} props.sidebarVisible - Whether sidebar is visible
 * @param {Function} props.onToggleSidebar - Callback to toggle sidebar
 * 
 * @example
 * <ChatHeader
 *   models={models}
 *   selectedModel={selectedModel}
 *   onSelectModel={setSelectedModel}
 *   isDark={isDark}
 *   onToggleTheme={toggleTheme}
 *   sidebarVisible={sidebarVisible}
 *   onToggleSidebar={toggleSidebar}
 * />
 */
const ChatHeader = ({ 
  models, 
  selectedModel, 
  onSelectModel,
  isDark,
  onToggleTheme,
  sidebarVisible,
  onToggleSidebar,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-4 transition-colors duration-300">
      <div className="w-full max-w-3xl mx-auto flex items-center gap-3 px-0 sm:px-0">
        {/* Sidebar Toggle */}
        <SidebarToggle
          isVisible={sidebarVisible}
          onToggle={onToggleSidebar}
        />

        {/* Model Selector */}
        <div className="flex-1 min-w-0">
          <ModelSelector
            models={models}
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle
          isDark={isDark}
          onToggle={onToggleTheme}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
