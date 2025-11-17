/**
 * SearchModal Component
 * 
 * Modal popup for searching through chat conversations.
 * Displays search input and filtered conversation results.
 * 
 * @module components/SearchModal
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Search } from 'lucide-react';

/**
 * Search modal component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Array} props.conversations - Array of conversation objects
 * @param {Function} props.onSelectConversation - Callback when conversation is selected
 * 
 * @example
 * <SearchModal
 *   isOpen={searchOpen}
 *   onClose={() => setSearchOpen(false)}
 *   conversations={conversations}
 *   onSelectConversation={handleSelect}
 * />
 */
const SearchModal = ({ isOpen, onClose, conversations, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const inputRef = useRef(null);

  /**
   * Filter conversations based on search query
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(msg => 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  /**
   * Auto-focus input when modal opens
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = (convId) => {
    onSelectConversation(convId);
    onClose();
    setSearchQuery('');
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    onClose();
    setSearchQuery('');
  };

  /**
   * Handle Escape key to close modal
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleClose}
        aria-label="Close search"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 pointer-events-none">
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Search Input */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
              <Search size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-base"
                aria-label="Search conversations"
              />
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close search"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Search size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchQuery ? 'No conversations found' : 'Start typing to search...'}
                </p>
              </div>
            ) : (
              <div className="py-2">
                {/* Group by time period */}
                {searchQuery === '' && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Previous 7 Days
                  </div>
                )}
                
                {filteredConversations.map((conv) => (
                  <SearchResultItem
                    key={conv.id}
                    conversation={conv}
                    searchQuery={searchQuery}
                    onSelect={() => handleSelectConversation(conv.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Individual search result item
 * 
 * @component
 * @private
 */
const SearchResultItem = ({ conversation, searchQuery, onSelect }) => {
  /**
   * Highlight matching text in search results
   */
  const highlightText = (text) => {
    if (!searchQuery) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={index} className="bg-blue-600/30 text-blue-400">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Get first message preview
  const firstMessage = conversation.messages[0]?.content || '';
  const preview = firstMessage.length > 60 
    ? firstMessage.substring(0, 60) + '...' 
    : firstMessage;

  return (
    <button
      onClick={onSelect}
      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
    >
      <MessageSquare size={18} className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          {highlightText(conversation.title)}
        </div>
        {preview && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {highlightText(preview)}
          </div>
        )}
      </div>
    </button>
  );
};

export default SearchModal;
