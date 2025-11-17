/**
 * Sidebar Component
 * 
 * ChatGPT-style sidebar with navigation menu and conversation list.
 * Features new chat button, search, library access, and user profile.
 * 
 * @module components/Sidebar
 */

import React, { useState } from 'react';
import { MessageSquare, Trash2, Search, BookOpen, FolderOpen, User, X } from 'lucide-react';
import SearchModal from './SearchModal';

/**
 * Sidebar component for conversation management
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.conversations - Array of conversation objects
 * @param {string|null} props.currentConvId - ID of the currently active conversation
 * @param {boolean} props.isVisible - Whether sidebar is currently visible
 * @param {Function} props.onNewChat - Callback when new chat button is clicked
 * @param {Function} props.onSelectConversation - Callback when a conversation is selected
 * @param {Function} props.onDeleteConversation - Callback when delete button is clicked
 * @param {Function} props.onClose - Callback when close button is clicked (mobile)
 * 
 * @example
 * <Sidebar
 *   conversations={conversations}
 *   currentConvId={currentConvId}
 *   isVisible={sidebarVisible}
 *   onNewChat={handleNewChat}
 *   onSelectConversation={handleSelect}
 *   onDeleteConversation={handleDelete}
 *   onClose={handleClose}
 * />
 */
const Sidebar = ({
  conversations = [],
  currentConvId,
  isVisible = true,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}) => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <>
      <div 
        className="sidebar w-full sm:w-64 md:w-72 lg:w-80 bg-gray-50 dark:bg-gray-900 flex flex-col flex-shrink-0 h-full shadow-2xl border-r border-gray-200 dark:border-gray-700"
      >
      {/* Header Section */}
      <div className="flex items-center justify-between p-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <MessageSquare size={18} className="text-white dark:text-black" />
          </div>
        </div>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="sm:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-2">
        <button
          onClick={onNewChat}
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-3"
          aria-label="Create new chat"
        >
          <MessageSquare size={18} />
          New chat
        </button>
      </div>

      {/* Menu Items */}
      <div className="px-3 py-2 space-y-1">
        <MenuItem icon={Search} label="Search chats" onClick={() => setSearchModalOpen(true)} />
        <MenuItem icon={BookOpen} label="Library" onClick={() => {}} />
        <MenuItem icon={FolderOpen} label="Projects" onClick={() => {}} />
      </div>

      {/* Chats Section */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Chats</div>
        {conversations.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-8 px-2">
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={currentConvId === conv.id}
                onSelect={() => onSelectConversation(conv.id)}
                onDelete={() => onDeleteConversation(conv.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">User</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Free plan</div>
          </div>
        </div>
      </div>
    </div>

    {/* Search Modal */}
    <SearchModal
      isOpen={searchModalOpen}
      onClose={() => setSearchModalOpen(false)}
      conversations={conversations}
      onSelectConversation={onSelectConversation}
    />
  </>
  );
};

/**
 * Menu item component
 * 
 * @component
 * @private
 */
const MenuItem = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
      aria-label={label}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

/**
 * Individual conversation item in the sidebar
 * 
 * @component
 * @private
 */
const ConversationItem = ({ conversation, isActive, onSelect, onDelete }) => {
  return (
    <div
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-gray-200 dark:bg-gray-800' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select conversation: ${conversation.title}`}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
        }
      }}
    >
      <MessageSquare size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate" title={conversation.title}>
        {conversation.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
        aria-label="Delete conversation"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default Sidebar;
