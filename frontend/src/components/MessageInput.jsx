/**
 * MessageInput Component
 * 
 * Text input area for composing and sending messages.
 * Features auto-expanding textarea, keyboard shortcuts, and send button.
 * 
 * @module components/MessageInput
 */

import React, { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { UI_CONFIG } from '../constants/config';

/**
 * Message input component with auto-expanding textarea
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Callback when send button is clicked
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.isLoading - Whether a message is currently being sent
 * @param {string} props.placeholder - Placeholder text for the textarea
 * 
 * @example
 * <MessageInput
 *   onSendMessage={handleSend}
 *   disabled={!currentConvId}
 *   isLoading={isLoading}
 * />
 */
const MessageInput = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Type your message..." 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const textareaRef = useRef(null);

  /**
   * Handle sending the message
   */
  const handleSend = () => {
    if (!inputMessage.trim() || disabled || isLoading) {
      return;
    }

    onSendMessage(inputMessage.trim());
    setInputMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  /**
   * Handle Enter key press (send) and Shift+Enter (new line)
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Auto-expand textarea as user types
   */
  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  /**
   * Handle textarea value change
   */
  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="p-4 sm:p-4 transition-colors duration-300">
      <div className="w-full max-w-3xl mx-auto px-0 sm:px-0">
        <div className="flex gap-3 items-end">
          {/* Auto-expanding Textarea */}
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="flex-1 resize-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-blue-500 focus:border-transparent text-base sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            rows="1"
            style={{
              minHeight: UI_CONFIG.MIN_MESSAGE_HEIGHT,
              maxHeight: UI_CONFIG.MAX_MESSAGE_HEIGHT,
            }}
            aria-label="Message input"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={disabled || isLoading || !inputMessage.trim()}
            className="bg-black dark:bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center hidden sm:block">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
