/**
 * SidebarToggle Component
 * 
 * Button component for showing and hiding the sidebar.
 * Displays appropriate icon based on sidebar visibility state.
 * Used to maximize chat area space when needed.
 * 
 * @module components/SidebarToggle
 */

import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

/**
 * Sidebar toggle button component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether sidebar is currently visible
 * @param {Function} props.onToggle - Callback function when toggle is clicked
 * @param {string} props.className - Additional CSS classes
 * 
 * @example
 * <SidebarToggle
 *   isVisible={sidebarVisible}
 *   onToggle={toggleSidebar}
 * />
 */
const SidebarToggle = ({ isVisible, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`sidebar-toggle p-2.5 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label={isVisible ? 'Hide sidebar' : 'Show sidebar'}
      title={isVisible ? 'Hide sidebar' : 'Show sidebar'}
    >
      {isVisible ? (
        <PanelLeftClose size={22} className="text-gray-700 dark:text-gray-400" />
      ) : (
        <PanelLeftOpen size={22} className="text-gray-700 dark:text-gray-400" />
      )}
    </button>
  );
};

export default SidebarToggle;
