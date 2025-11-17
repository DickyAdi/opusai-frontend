/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the React application.
 * It handles the initialization and rendering of the App component into the DOM.
 * 
 * @module index
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';

/**
 * Initialize and render the React application
 * Creates the root element and renders the App component with StrictMode enabled
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);