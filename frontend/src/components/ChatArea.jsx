/**
 * ChatArea Component
 * 
 * Main chat interface combining header, message list, and input components.
 * Orchestrates the chat interaction flow. Displays welcome page when no conversation active.
 * 
 * @module components/ChatArea
 */

import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WelcomePage from './WelcomePage';

/**
 * Complete chat area component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.models - Array of available model objects
 * @param {string} props.selectedModel - ID of the currently selected model
 * @param {Function} props.onSelectModel - Callback when a model is selected
 * @param {Array} props.messages - Array of message objects
 * @param {Function} props.onSendMessage - Callback when a message is sent
 * @param {boolean} props.isLoading - Whether a message is being processed
 * @param {boolean} props.disabled - Whether the chat input is disabled
 * @param {boolean} props.showWelcome - Whether to show welcome page
 * @param {boolean} props.isDark - Whether dark theme is active
 * @param {Function} props.onToggleTheme - Callback to toggle theme
 * @param {boolean} props.sidebarVisible - Whether sidebar is visible
 * @param {Function} props.onToggleSidebar - Callback to toggle sidebar
 * 
 * @example
 * <ChatArea
 *   models={models}
 *   selectedModel={selectedModel}
 *   onSelectModel={setSelectedModel}
 *   messages={messages}
 *   onSendMessage={handleSend}
 *   isLoading={isLoading}
 *   disabled={!currentConvId}
 *   showWelcome={!currentConvId}
 *   isDark={isDark}
 *   onToggleTheme={toggleTheme}
 *   sidebarVisible={sidebarVisible}
 *   onToggleSidebar={toggleSidebar}
 * />
 */
const ChatArea = ({
  models,
  selectedModel,
  onSelectModel,
  messages,
  onSendMessage,
  isLoading,
  disabled,
  showWelcome,
  isDark,
  onToggleTheme,
  sidebarVisible,
  onToggleSidebar,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header with Controls */}
      <ChatHeader
        models={models}
        selectedModel={selectedModel}
        onSelectModel={onSelectModel}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Main Content Area */}
      {showWelcome ? (
        <WelcomePage
          onSendMessage={onSendMessage}
          disabled={disabled}
          isLoading={isLoading}
        />
      ) : (
        <>
          {/* Messages Display Area */}
          <MessageList messages={messages} isLoading={isLoading} />

          {/* Message Input Area */}
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={disabled}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default ChatArea;
