/**
 * WelcomePage Component
 * 
 * Displays a centered welcome screen when no conversation is active.
 * Includes a heading and message input for starting a new conversation.
 * Provides a clean, focused entry point for users.
 * 
 * @module components/WelcomePage
 */

import React from 'react';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';

/**
 * Welcome page component with centered layout
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Callback when user sends first message
 * @param {boolean} props.disabled - Whether input should be disabled
 * @param {boolean} props.isLoading - Whether a message is being processed
 * 
 * @example
 * <WelcomePage
 *   onSendMessage={handleFirstMessage}
 *   disabled={!selectedModel}
 *   isLoading={isLoading}
 * />
 */
const WelcomePage = ({ onSendMessage, disabled, isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 sm:px-6">
      <div className="w-full max-w-2xl">
        {/* Welcome Icon */}
        <div className="flex justify-center mb-6 sm:mb-6">
          <div className="p-4 sm:p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <MessageSquare 
              size={48} 
              className="text-gray-400 dark:text-gray-500" 
            />
          </div>
        </div>

        {/* Welcome Heading */}
        <h1 className="text-3xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-3 sm:mb-3">
          Start a Conversation
        </h1>

        {/* Welcome Description */}
        <p className="text-base sm:text-base text-gray-600 dark:text-gray-400 text-center mb-8 sm:mb-8">
          Begin your chat by typing a message below
        </p>

        {/* Message Input */}
        <div className="w-full">
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={disabled}
            isLoading={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
