/**
 * App Component
 * 
 * Main application component that orchestrates the chat interface.
 * Manages state for models, conversations, chat interactions, theme, and sidebar visibility.
 * Connects all sub-components and handles business logic.
 * 
 * @module components/App
 */

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { useConversations } from '../hooks/useConversations';
import { useChat } from '../hooks/useChat';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { fetchModels } from '../services/api.service';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Main App component
 * 
 * @component
 * @returns {JSX.Element} The complete chat application interface
 * 
 * @example
 * <App />
 */
function App() {
  // ===== STATE MANAGEMENT =====
  
  // Models state
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useLocalStorage(STORAGE_KEYS.SELECTED_MODEL, '');
  
  // Theme state (using custom hook)
  const { isDark, toggleTheme } = useTheme();
  
  // Sidebar visibility state with responsive behavior
  const [sidebarVisible, setSidebarVisible] = useLocalStorage(STORAGE_KEYS.SIDEBAR_VISIBLE, true);
  
  // Conversations state (using custom hook)
  const {
    conversations,
    currentConvId,
    currentMessages,
    createNewConversation,
    deleteConversation,
    setCurrentConvId,
    updateConversationMessages,
    updateConversationTitle,
  } = useConversations();

  // Local messages state for real-time updates during streaming
  const [messages, setMessages] = useState([]);
  
  // Track if we're currently streaming to prevent update loops
  const isStreamingRef = useRef(false);
  
  // Track previous conversation ID to detect conversation switches
  const prevConvIdRef = useRef(currentConvId);

  /**
   * Handle responsive sidebar visibility based on screen size
   */
  useEffect(() => {
    const handleResize = () => {
      // Hide sidebar on mobile (< 640px), show on larger screens
      if (window.innerWidth < 640) {
        setSidebarVisible(false);
      } else if (window.innerWidth >= 640) {
        // Show sidebar by default on tablet and desktop
        const storedValue = localStorage.getItem(STORAGE_KEYS.SIDEBAR_VISIBLE);
        if (storedValue) {
          setSidebarVisible(JSON.parse(storedValue));
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== CHAT HOOK =====
  
  /**
   * Chat hook for handling message sending and streaming
   */
  const { sendMessage, isLoading } = useChat({
    onMessageUpdate: (chunk) => {
      // Set streaming flag to prevent update loops
      isStreamingRef.current = true;
      
      // Update the last message with new content as it streams in
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        
        if (lastMsg && lastMsg.role === 'assistant') {
          // Append to existing assistant message
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            content: lastMsg.content + chunk,
          };
        } else {
          // Create new assistant message
          newMessages.push({
            role: 'assistant',
            content: chunk,
          });
        }
        
        return newMessages;
      });
    },
    onError: (error) => {
      // Show error message in chat
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error.message}`,
        },
      ]);
    },
  });

  // ===== EFFECTS =====

  /**
   * Initialize on component mount
   * Load models and reset streaming flags
   */
  useEffect(() => {
    // Reset streaming flag on mount (after refresh)
    isStreamingRef.current = false;
    
    // Load available models
    loadModels();
    
    // Load messages for current conversation if exists
    if (currentConvId && currentMessages.length > 0) {
      setMessages(currentMessages);
      console.log('Loaded messages from localStorage:', currentMessages.length, 'messages');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Update local messages when conversation changes
   * Only update if not currently streaming to prevent loops
   */
  useEffect(() => {
    // Only update if conversation ID actually changed
    if (prevConvIdRef.current !== currentConvId) {
      prevConvIdRef.current = currentConvId;
      isStreamingRef.current = false; // Reset streaming flag on conversation switch
      setMessages(currentMessages);
    }
  }, [currentConvId, currentMessages]);

  /**
   * Reset streaming flag when loading completes
   */
  useEffect(() => {
    if (!isLoading && isStreamingRef.current) {
      // Streaming completed, reset flag
      isStreamingRef.current = false;
      console.log('Streaming completed, flag reset');
    }
  }, [isLoading]);

  /**
   * Save messages to conversation after streaming completes OR when messages change
   * CRITICAL: This ensures messages are ALWAYS saved to localStorage
   */
  useEffect(() => {
    if (!currentConvId || messages.length === 0) {
      return;
    }

    // Find current conversation
    const currentConv = conversations.find(c => c.id === currentConvId);
    
    if (!currentConv) {
      return;
    }

    // Check if messages have actually changed
    const messagesChanged = JSON.stringify(currentConv.messages) !== JSON.stringify(messages);
    
    if (messagesChanged) {
      // Save immediately to localStorage
      updateConversationMessages(currentConvId, messages);
      console.log('Messages saved to localStorage:', messages.length, 'messages');
    }
  }, [messages, currentConvId, conversations, updateConversationMessages]);

  // ===== HANDLERS =====

  /**
   * Fetches available models from the API
   * Sets the first model as selected if none is selected
   */
  const loadModels = async () => {
    try {
      const fetchedModels = await fetchModels();
      setModels(fetchedModels);
      
      // Auto-select first model if none selected
      if (fetchedModels.length > 0 && !selectedModel) {
        setSelectedModel(fetchedModels[0].id);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  /**
   * Creates a new conversation
   * Clear messages immediately to show welcome page
   */
  const handleNewChat = () => {
    // Clear current messages immediately
    setMessages([]);
    // Reset streaming flag
    isStreamingRef.current = false;
    // Create new conversation
    const newConvId = createNewConversation();
    // Update prev ref to prevent message update loop
    prevConvIdRef.current = newConvId;
  };

  /**
   * Handles sending a new message
   * Creates new conversation if none exists
   * @param {string} content - The message content
   */
  const handleSendMessage = async (content) => {
    if (!selectedModel) {
      return;
    }

    // Create new conversation if none exists
    let conversationId = currentConvId;
    if (!conversationId) {
      conversationId = createNewConversation();
      // Update ref immediately to prevent useEffect interference
      prevConvIdRef.current = conversationId;
    }

    // Create user message
    const userMessage = {
      role: 'user',
      content,
    };

    // Update messages immediately with user message (SYNC)
    const updatedMessages = [...messages, userMessage];
    
    // Set streaming flag before updating messages
    isStreamingRef.current = true;
    
    // Update local state immediately
    setMessages(updatedMessages);

    // Update conversation in localStorage
    updateConversationMessages(conversationId, updatedMessages);

    // Update title if this is the first message
    if (messages.length === 0) {
      updateConversationTitle(conversationId, content);
    }

    // Send message to API (streaming will update via onMessageUpdate callback)
    try {
      await sendMessage({
        model: selectedModel,
        messages: updatedMessages,
      });
      console.log('Message sent successfully');
    } catch (error) {
      // Error handling is done in useChat hook
      console.error('Error sending message:', error);
      // Reset streaming flag on error
      isStreamingRef.current = false;
    }
  };

  /**
   * Handles conversation selection
   * @param {string} convId - The conversation ID to select
   */
  const handleSelectConversation = (convId) => {
    setCurrentConvId(convId);
    
    // Auto-close sidebar on mobile after selecting conversation
    if (window.innerWidth < 640) {
      setSidebarVisible(false);
    }
  };

  /**
   * Handles conversation deletion
   * @param {string} convId - The conversation ID to delete
   */
  const handleDeleteConversation = (convId) => {
    deleteConversation(convId);
  };

  /**
   * Handles model selection
   * @param {string} modelId - The model ID to select
   */
  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
  };

  /**
   * Toggles sidebar visibility
   */
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  // ===== RENDER =====

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300 ${
          sidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarVisible(false)}
        aria-label="Close sidebar"
      />
      
      {/* Sidebar - Conversation List */}
      <div 
        className={`sidebar-container fixed sm:relative z-50 sm:z-auto h-full overflow-hidden transition-all duration-400 ease-in-out ${
          sidebarVisible 
            ? 'translate-x-0 w-full sm:w-64 md:w-72 lg:w-80' 
            : '-translate-x-full sm:translate-x-0 sm:w-0'
        }`}
        style={{
          flexShrink: 0
        }}
      >
        <Sidebar
          conversations={conversations}
          currentConvId={currentConvId}
          isVisible={true}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onClose={() => setSidebarVisible(false)}
        />
      </div>

      {/* Main Chat Area */}
      <ChatArea
        models={models}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!selectedModel}
        showWelcome={!currentConvId || messages.length === 0}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        sidebarVisible={sidebarVisible}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}

export default App;
