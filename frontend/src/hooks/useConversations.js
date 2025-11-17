/**
 * Conversations Hook
 * 
 * Custom React hook for managing conversation state and operations.
 * Handles creating, updating, and deleting conversations with localStorage persistence.
 * 
 * @module hooks/useConversations
 */

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants/config';
import { generateConversationTitle } from '../utils/helpers';

/**
 * Hook for managing conversations
 * 
 * @function useConversations
 * @returns {Object} Conversation state and methods
 * @returns {Array} return.conversations - Array of conversation objects
 * @returns {string|null} return.currentConvId - Current active conversation ID
 * @returns {Array} return.currentMessages - Messages for current conversation
 * @returns {Function} return.createNewConversation - Creates a new conversation
 * @returns {Function} return.deleteConversation - Deletes a conversation
 * @returns {Function} return.setCurrentConvId - Sets the active conversation
 * @returns {Function} return.updateConversationMessages - Updates messages in a conversation
 * @returns {Function} return.updateConversationTitle - Updates conversation title
 * 
 * @example
 * const {
 *   conversations,
 *   currentConvId,
 *   createNewConversation,
 *   deleteConversation
 * } = useConversations();
 */
export const useConversations = () => {
  // Persistent state using localStorage
  const [conversations, setConversations] = useLocalStorage(STORAGE_KEYS.CONVERSATIONS, []);
  const [currentConvId, setCurrentConvId] = useLocalStorage(STORAGE_KEYS.CURRENT_CONVERSATION_ID, null);

  /**
   * Get messages for the current conversation
   * @returns {Array} Array of message objects
   */
  const currentMessages = currentConvId
    ? conversations.find(c => c.id === currentConvId)?.messages || []
    : [];

  /**
   * Creates a new conversation and sets it as active
   * @function createNewConversation
   * @returns {string} ID of the newly created conversation
   */
  const createNewConversation = useCallback(() => {
    const newConv = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    
    setConversations(prev => [newConv, ...prev]);
    setCurrentConvId(newConv.id);
    
    return newConv.id;
  }, [setConversations, setCurrentConvId]);

  /**
   * Deletes a conversation by ID
   * If the deleted conversation was active, clears the current conversation
   * 
   * @function deleteConversation
   * @param {string} convId - ID of the conversation to delete
   */
  const deleteConversation = useCallback((convId) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    
    // Clear current conversation if it was deleted
    if (currentConvId === convId) {
      setCurrentConvId(null);
    }
  }, [currentConvId, setConversations, setCurrentConvId]);

  /**
   * Updates messages in a conversation
   * 
   * @function updateConversationMessages
   * @param {string} convId - ID of the conversation to update
   * @param {Array} messages - New messages array
   */
  const updateConversationMessages = useCallback((convId, messages) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return { ...conv, messages };
      }
      return conv;
    }));
  }, [setConversations]);

  /**
   * Updates conversation title based on first message
   * Only updates if the current title is "New Chat"
   * 
   * @function updateConversationTitle
   * @param {string} convId - ID of the conversation to update
   * @param {string} firstMessage - First user message to generate title from
   */
  const updateConversationTitle = useCallback((convId, firstMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId && conv.title === 'New Chat') {
        return {
          ...conv,
          title: generateConversationTitle(firstMessage),
        };
      }
      return conv;
    }));
  }, [setConversations]);

  return {
    conversations,
    currentConvId,
    currentMessages,
    createNewConversation,
    deleteConversation,
    setCurrentConvId,
    updateConversationMessages,
    updateConversationTitle,
  };
};

export default useConversations;
