/**
 * API Service
 * 
 * Handles all API communications with the backend server.
 * Provides methods for fetching models and streaming chat completions.
 * 
 * @module services/api.service
 */

import { API_BASE_URL, API_ENDPOINTS } from '../constants/config';

/**
 * Fetches available AI models from the API
 * 
 * @async
 * @function fetchModels
 * @returns {Promise<Array>} Array of available model objects
 * @throws {Error} When the API request fails
 * 
 * @example
 * const models = await fetchModels();
 * console.log(models); // [{ id: 'model-1', n_ctx: 2048 }, ...]
 */
export const fetchModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MODELS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

/**
 * Sends a chat completion request with streaming support
 * 
 * @async
 * @function streamChatCompletion
 * @param {Object} params - Request parameters
 * @param {string} params.model - Model ID to use for completion
 * @param {Array} params.messages - Array of message objects with role and content
 * @param {Function} params.onChunk - Callback function called for each streamed chunk
 * @param {AbortSignal} params.signal - AbortController signal for cancelling the request
 * 
 * @returns {Promise<string>} The complete response text
 * @throws {Error} When the API request fails
 * 
 * @example
 * const controller = new AbortController();
 * const response = await streamChatCompletion({
 *   model: '<ALIAS_MODEL>',
 *   messages: [{ role: 'user', content: 'Hello' }],
 *   onChunk: (chunk) => console.log(chunk),
 *   signal: controller.signal
 * });
 */
export const streamChatCompletion = async ({ model, messages, onChunk, signal }) => {
  try {
    // Make the API request with streaming enabled
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHAT_COMPLETIONS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Initialize reader and decoder for streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    // Process the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      // Decode the chunk and split by lines
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      // Process each line
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          
          // Skip the [DONE] marker
          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            // If there's content, accumulate it and call the callback
            if (content) {
              fullContent += content;
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    }

    return fullContent;
  } catch (error) {
    // Handle abort errors gracefully
    if (error.name === 'AbortError') {
      console.log('Request aborted by user');
      throw error;
    }
    
    console.error('Error in chat completion:', error);
    throw error;
  }
};

/**
 * API Service object - default export
 * Provides a clean interface for all API operations
 */
const apiService = {
  fetchModels,
  streamChatCompletion,
};

export default apiService;
