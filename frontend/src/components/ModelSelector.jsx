/**
 * ModelSelector Component
 * 
 * Dropdown component for selecting AI models.
 * Displays available models with their context window sizes.
 * 
 * @module components/ModelSelector
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Model selector dropdown component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.models - Array of available model objects
 * @param {string} props.selectedModel - ID of the currently selected model
 * @param {Function} props.onSelectModel - Callback when a model is selected
 * @param {boolean} props.disabled - Whether the selector is disabled
 * 
 * @example
 * <ModelSelector
 *   models={models}
 *   selectedModel={selectedModel}
 *   onSelectModel={setSelectedModel}
 *   disabled={false}
 * />
 */
const ModelSelector = ({ 
  models = [], 
  selectedModel, 
  onSelectModel,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the current model object
  const currentModel = models.find(m => m.id === selectedModel);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Handle model selection
   */
  const handleSelectModel = (modelId) => {
    onSelectModel(modelId);
    setIsOpen(false);
  };

  /**
   * Toggle dropdown open/closed
   */
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Select AI model"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate pr-2">
          {currentModel?.id || 'Select Model'}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
          role="listbox"
        >
          {models.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No models available
            </div>
          ) : (
            models.map((model) => (
              <ModelOption
                key={model.id}
                model={model}
                isSelected={selectedModel === model.id}
                onSelect={handleSelectModel}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Individual model option in the dropdown
 * 
 * @component
 * @private
 */
const ModelOption = ({ model, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(model.id)}
      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
        isSelected ? 'bg-gray-50 dark:bg-gray-700 font-medium' : ''
      }`}
      role="option"
      aria-selected={isSelected}
    >
      <div className="font-medium text-gray-900 dark:text-gray-100">{model.id}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Context: {model.n_ctx?.toLocaleString() || 'N/A'} tokens
      </div>
    </button>
  );
};

export default ModelSelector;
