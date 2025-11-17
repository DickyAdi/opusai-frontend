/**
 * MessageList Component
 * 
 * Displays the list of messages in a conversation.
 * Handles both user and assistant messages with appropriate styling.
 * Includes auto-scrolling to latest messages and loading states.
 * Supports markdown rendering for rich text formatting.
 * 
 * @module components/MessageList
 */

import React, { useRef, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

/**
 * Message list component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects with role and content
 * @param {boolean} props.isLoading - Whether a message is currently being loaded
 * 
 * @example
 * <MessageList
 *   messages={messages}
 *   isLoading={isLoading}
 * />
 */
const MessageList = ({ messages = [], isLoading = false }) => {
  const messagesEndRef = useRef(null);

  /**
   * Auto-scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <LoadingIndicator />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

/**
 * Empty state component when no messages exist
 * Note: This is no longer displayed when using WelcomePage
 * 
 * @component
 * @private
 */
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <MessageSquare size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Start a conversation
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Select a model and send a message to begin
      </p>
    </div>
  );
};

/**
 * Individual message component with markdown support
 * 
 * @component
 * @private
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object with role and content
 */
const Message = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`mb-4 sm:mb-6 ${isUser ? 'flex justify-end' : ''}`}
      role="article"
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] transition-colors duration-300 overflow-hidden ${
          isUser
            ? 'bg-black dark:bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 sm:px-4 sm:py-3'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 sm:px-4 sm:py-3 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className={`markdown-content text-sm break-words ${isUser ? 'markdown-user' : 'markdown-assistant'}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              // Custom styling for code blocks
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <pre className="bg-gray-900 dark:bg-black rounded-lg p-3 overflow-x-auto my-2 max-w-full">
                    <code className={`${className} block whitespace-pre-wrap break-words`} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code 
                    className={`${isUser ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'} px-1.5 py-0.5 rounded text-xs font-mono break-words`} 
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Custom styling for links
              a: ({ node, children, ...props }) => (
                <a
                  className={`${isUser ? 'text-blue-200 hover:text-blue-100' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} underline`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              ),
              // Custom styling for lists
              ul: ({ node, children, ...props }) => (
                <ul className="list-disc list-inside space-y-1 my-2" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ node, children, ...props }) => (
                <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
                  {children}
                </ol>
              ),
              // Custom styling for blockquotes
              blockquote: ({ node, children, ...props }) => (
                <blockquote 
                  className={`border-l-4 ${isUser ? 'border-white/40' : 'border-gray-300 dark:border-gray-600'} pl-4 italic my-2`} 
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              // Custom styling for headings
              h1: ({ node, children, ...props }) => (
                <h1 className="text-xl font-bold mt-4 mb-2" {...props}>{children}</h1>
              ),
              h2: ({ node, children, ...props }) => (
                <h2 className="text-lg font-bold mt-3 mb-2" {...props}>{children}</h2>
              ),
              h3: ({ node, children, ...props }) => (
                <h3 className="text-base font-bold mt-2 mb-1" {...props}>{children}</h3>
              ),
              // Custom styling for paragraphs
              p: ({ node, children, ...props }) => (
                <p className="my-1 leading-relaxed break-words" {...props}>{children}</p>
              ),
              // Custom styling for tables
              table: ({ node, children, ...props }) => (
                <div className="overflow-x-auto my-2 max-w-full">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 table-auto" {...props}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ node, children, ...props }) => (
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 font-semibold text-left break-words" {...props}>
                  {children}
                </th>
              ),
              td: ({ node, children, ...props }) => (
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 break-words" {...props}>
                  {children}
                </td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading indicator component
 * 
 * @component
 * @private
 */
const LoadingIndicator = () => {
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-200 dark:border-gray-700 max-w-[80%] transition-colors duration-300">
        <Loader2 size={20} className="animate-spin text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
};

export default MessageList;
