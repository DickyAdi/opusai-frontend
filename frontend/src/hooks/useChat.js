/**
 * Chat Hook
 * 
 * Custom React hook for managing chat interactions with AI models.
 * Handles sending messages, streaming responses, and managing loading states.
 * 
 * @module hooks/useChat
 */

import { useState, useRef, useCallback } from 'react';
import { streamChatCompletion } from '../services/api.service';

/**
 * Hook for managing chat operations
 * 
 * @function useChat
 * @param {Object} params - Hook parameters
 * @param {Function} params.onMessageUpdate - Callback when a new message chunk arrives
 * @param {Function} params.onError - Callback when an error occurs
 * @returns {Object} Chat state and methods
 * 
 * @example
 * const { sendMessage, isLoading, cancelRequest } = useChat({
 *   onMessageUpdate: (content) => console.log(content),
 *   onError: (error) => console.error(error)
 * });
 */
export const useChat = ({ onMessageUpdate, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  /**
   * Sends a message to the AI model and handles streaming response
   * 
   * @async
   * @function sendMessage
   * @param {Object} params - Message parameters
   * @param {string} params.model - Model ID to use
   * @param {Array} params.messages - Array of message objects
   * @returns {Promise<string>} The complete response content
   */
  const sendMessage = useCallback(async ({ model, messages }) => {
    if (isLoading) {
      console.warn('A message is already being sent');
      return;
    }

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const fullContent = await streamChatCompletion({
        model,
        messages,
        onChunk: onMessageUpdate,
        signal: abortControllerRef.current.signal,
      });

      return fullContent;
    } catch (error) {
      if (error.name !== 'AbortError') {
        onError?.(error);
      }
      throw error;
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, onMessageUpdate, onError]);

  /**
   * Cancels the current ongoing request
   * 
   * @function cancelRequest
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    cancelRequest,
  };
};

export default useChat;
