# Chat AI - Minimal Chat Interface

A clean and minimal chat interface for interacting with AI models. Built with React and designed to work with OpenAI-compatible APIs. Features dark theme support, markdown rendering, conversation search, collapsible sidebar, and streaming responses with full mobile responsiveness.

## Project Structure

```
chat-ai/
├── public/                      # Static files
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/              # React components
│   │   ├── App.jsx             # Main application component
│   │   ├── Sidebar.jsx         # Conversation list sidebar with search
│   │   ├── ChatArea.jsx        # Main chat interface
│   │   ├── ChatHeader.jsx      # Header with controls
│   │   ├── MessageList.jsx     # Message display with markdown rendering
│   │   ├── MessageInput.jsx    # Message input with auto-expand
│   │   ├── ModelSelector.jsx   # Dropdown for model selection
│   │   ├── ThemeToggle.jsx     # Theme switcher button
│   │   ├── SidebarToggle.jsx   # Sidebar visibility toggle
│   │   ├── WelcomePage.jsx     # Welcome screen component
│   │   ├── SearchModal.jsx     # Search conversations modal
│   │   └── index.js            # Component exports
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useLocalStorage.js  # localStorage management hook
│   │   ├── useConversations.js # Conversation state management
│   │   ├── useChat.js          # Chat operations and streaming
│   │   └── useTheme.js         # Theme management hook
│   │
│   ├── services/                # API and external services
│   │   └── api.service.js      # API communication layer
│   │
│   ├── utils/                   # Utility functions
│   │   └── helpers.js          # Helper functions (formatting, validation)
│   │
│   ├── constants/               # Constants and configuration
│   │   └── config.js           # App configuration and constants
│   │
│   ├── index.js                 # Application entry point
│   └── index.css                # Global styles with markdown support
│
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── SEARCH_FEATURE.md           # Search feature documentation
└── README.md                    # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- An OpenAI-compatible API server

### Setup Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-ai
```

2. Install all dependencies:
```bash
npm install
```

This will install the following key packages:
- React 19.2.0 and React DOM 19.2.0
- Tailwind CSS 3.4.18 for styling
- Lucide React 0.553.0 for icons
- react-markdown 10.1.0 for markdown rendering
- remark-gfm 4.0.1 for GitHub Flavored Markdown
- rehype-highlight 7.0.2 for code syntax highlighting
- rehype-raw 7.0.0 for raw HTML support

3. Configure environment variables:

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and set your API configuration:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_NAME=Chat AI
REACT_APP_VERSION=1.0.0
```

4. Ensure your API server is running at the configured URL (default: `http://localhost:8000`)

## Usage

### Starting the Application

To start the development server:
```bash
npm run start
```

The application will automatically open in your default browser at `http://localhost:3000`

### Basic Operations

**Creating a New Conversation:**
- Click the "New Chat" button in the sidebar
- Or use the welcome page to start your first conversation

**Sending Messages:**
- Type your message in the input field at the bottom
- Press Enter to send (Shift+Enter for new line)
- Messages support markdown formatting

**Selecting AI Models:**
- Click the model selector dropdown in the header
- Choose from available models provided by your API

**Managing Conversations:**
- Click on any conversation in the sidebar to switch to it
- Click the trash icon next to a conversation to delete it
- Use the search icon to find specific conversations

**Searching Conversations:**
- Click the search icon in the sidebar
- Type keywords to filter conversations by title or content
- Click on a result to navigate to that conversation

**Theme Toggle:**
- Click the sun/moon icon in the header to switch between light and dark modes
- Theme preference is saved automatically

**Sidebar Toggle:**
- Click the sidebar toggle button in the header to show/hide the sidebar
- Useful for maximizing chat area on smaller screens

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift+Enter` - New line in message input
- `Esc` - Close search modal

## Architecture

### Component Architecture

- **App.jsx**: Main orchestrator component managing global state with fixed sidebar positioning using translate-x animation system
- **Sidebar.jsx**: Conversation history display with create/delete functionality and integrated search modal
- **ChatArea.jsx**: Main chat interface combining header, messages, and input components
- **ChatHeader.jsx**: Header section with model selector and theme/sidebar controls
- **MessageList.jsx**: Renders messages with full markdown support including code highlighting, tables, lists, and blockquotes
- **MessageInput.jsx**: Auto-expanding textarea with mobile-optimized touch targets and responsive sizing
- **ModelSelector.jsx**: Dropdown for selecting AI models with mobile-friendly button sizes
- **ThemeToggle.jsx**: Light/dark theme switcher with smooth transitions
- **SidebarToggle.jsx**: Toggle button for showing/hiding sidebar
- **WelcomePage.jsx**: Initial landing page with responsive spacing and icon sizes
- **SearchModal.jsx**: Modal popup for searching conversations with real-time filtering and theme support

### Custom Hooks

- **useLocalStorage**: Persistent state management with localStorage synchronization
- **useConversations**: Conversation CRUD operations and state management
- **useChat**: Chat message sending with streaming response handling
- **useTheme**: Theme state management with light/dark mode support

### Services

- **api.service.js**: Handles all API communications
  - `fetchModels()`: Gets available AI models from the API
  - `streamChatCompletion()`: Sends messages with streaming response support

### Utilities

- **helpers.js**: Common utility functions
  - Text formatting and truncation
  - Date formatting and display
  - Input validation
  - Unique ID generation

### Constants

- **config.js**: Centralized configuration
  - API endpoints and base URLs
  - LocalStorage keys
  - UI constants and defaults

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Base URL for the AI API | `http://localhost:8000` |
| `REACT_APP_NAME` | Application name | `Chat AI` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |

### API Requirements

The application expects an OpenAI-compatible API with the following endpoints:

- `GET /v1/models` - List available models
- `POST /v1/chat/completions` - Send chat messages (with streaming support)

## Features

### Core Functionality
- **Multiple Conversations**: Create and manage multiple chat sessions with persistent storage
- **Model Selection**: Choose from available AI models via dropdown selector
- **Streaming Responses**: Real-time streaming of AI responses with visual feedback
- **Persistent Storage**: All conversations automatically saved to localStorage
- **Auto-expanding Input**: Textarea dynamically grows with content up to maximum height
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line, Esc to close modals
- **Conversation Search**: Real-time search across all conversations with text highlighting
- **Markdown Support**: Full markdown rendering in chat messages including code blocks, tables, lists, and more

### Markdown Rendering
- **Code Blocks**: Syntax highlighting for multiple programming languages using highlight.js
- **GitHub Flavored Markdown**: Support for tables, task lists, strikethrough, and autolinks
- **Custom Components**: Styled components for code blocks, links, lists, tables, blockquotes, and headings
- **Copy Functionality**: One-click copy button for code blocks
- **Overflow Handling**: Proper text wrapping and overflow management for long content
- **Theme Support**: Markdown styles adapt to light and dark themes

### User Interface
- **Theme Support**: Toggle between light and dark modes with smooth transitions and full component support
- **Collapsible Sidebar**: Hide sidebar to maximize chat area with smooth translate-x animation
- **Welcome Page**: Centered, clean entry point for new conversations with responsive layout
- **Mobile Responsive**: Fully optimized for mobile devices including iPhone and Samsung Galaxy
- **Touch Optimized**: 44px minimum touch targets for all interactive elements
- **Proper Text Wrapping**: Comprehensive overflow handling prevents content cutoff on mobile
- **Adaptive Sizing**: Font sizes, padding, and spacing adjust for different screen sizes
- **Clean UI**: Minimal and modern interface with consistent design language

### Search Functionality
- **Modal Interface**: Clean popup modal for searching conversations
- **Real-time Filtering**: Instant results as you type with no delay
- **Keyword Highlighting**: Search terms highlighted in yellow for easy identification
- **Content Preview**: Shows relevant message preview for each result
- **Theme Consistent**: Search UI matches application theme (light/dark)
- **Keyboard Accessible**: ESC key to close, auto-focus on input field

## Development

### Available Scripts

- `npm run start` - Start development server on port 3000
- `npm run build` - Build optimized production bundle
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)

### Code Style

- **Comments**: JSDoc-style comments for functions and components
- **Naming**: Descriptive variable and function names following camelCase convention
- **Structure**: Organized by feature/concern with clear separation
- **Modularity**: Small, reusable components and functions following single responsibility principle

### Mobile Development

When developing mobile features:
- Test on actual device dimensions using browser developer tools
- Use iPhone XR (414x896) and Samsung Galaxy S20 Ultra (412x915) as reference sizes
- Ensure minimum 44px touch targets for all interactive elements
- Verify text wrapping with long words and URLs
- Test both portrait and landscape orientations
- Check overflow behavior with various content lengths

### Debugging

1. **Enable Development Mode**: Set `NODE_ENV=development` in environment
2. **Check Console**: All errors and warnings logged to browser console
3. **Inspect State**: Use React DevTools extension to inspect component state and props
4. **Network Tab**: Monitor API requests and responses in browser DevTools
5. **Mobile Testing**: Use browser DevTools device emulation for mobile debugging

## Build

To create a production build:

```bash
npm run build
```

The optimized files will be in the `build/` directory, ready for deployment to any static hosting service.

## Contributing

When contributing:

1. Follow the existing code structure
2. Add JSDoc comments to all functions
3. Test your changes thoroughly
4. Update README if adding new features

## License

This project is open source and available under the MIT License.

## Recent Updates

### Version 1.0.0 - Current

**Markdown Rendering Implementation:**
- Integrated react-markdown with remark-gfm, rehype-highlight, and rehype-raw plugins
- Added custom markdown components for code blocks, links, lists, tables, blockquotes, and headings
- Implemented syntax highlighting using highlight.js with github-dark theme
- Added copy-to-clipboard functionality for code blocks
- Created comprehensive markdown CSS styling in index.css

**Sidebar Visibility Fix:**
- Fixed sidebar not appearing at 100% zoom level
- Changed from conditional rendering to translate-x animation system
- Implemented proper overflow-hidden and width transitions
- Sidebar now smoothly slides in/out at all zoom levels

**Mobile Responsiveness:**
- Optimized all components for mobile devices (iPhone XR, Samsung Galaxy S20 Ultra)
- Increased touch target sizes to minimum 44px for accessibility
- Updated padding and spacing across all components (p-4, gap-3)
- Adjusted font sizes for better mobile readability (text-base on mobile)
- Increased icon sizes for better visibility (20-22px)

**Text Overflow Fixes:**
- Implemented comprehensive word-wrap and overflow-wrap in CSS
- Added word-break: break-word to handle long URLs and words
- Applied overflow-hidden to message bubble containers
- Added break-words utility classes throughout markdown components
- Configured responsive max-width for chat bubbles (90% mobile, 85% tablet, 80% desktop)

**Search Functionality:**
- Created SearchModal component with real-time conversation filtering
- Implemented keyword highlighting in search results
- Added message preview in search results
- Integrated search modal into sidebar with dedicated button
- Added keyboard shortcuts (ESC to close) and backdrop click-to-close
- Full theme support (light/dark mode) for search interface

**Theme Consistency:**
- Updated SearchModal with proper light/dark mode color schemes
- Ensured all components respect theme toggle
- Added smooth theme transitions across entire application

## Troubleshooting

### API Connection Issues

- Verify your API server is running at the configured URL
- Check `.env` file has correct `REACT_APP_API_BASE_URL`
- Ensure API endpoints match OpenAI-compatible format
- Verify CORS settings on your API server allow requests from localhost:3000

### localStorage Issues

- Check browser localStorage is enabled in settings
- Clear localStorage if data appears corrupted: `localStorage.clear()` in console
- Check browser console for storage quota errors
- Verify localStorage permissions are not blocked by browser extensions

### Build Issues

- Delete `node_modules` and reinstall: `Remove-Item -Recurse -Force node_modules; npm install`
- Clear npm cache: `npm cache clean --force`
- Update Node.js to latest LTS version
- Check for conflicting global packages

### Mobile Display Issues

- Clear browser cache and hard reload (Ctrl+Shift+R)
- Test in browser developer tools with device emulation
- Verify viewport meta tag is present in index.html
- Check for browser-specific CSS issues in console

### Markdown Rendering Issues

- Ensure all markdown packages are installed: `npm list react-markdown remark-gfm rehype-highlight rehype-raw`
- Check browser console for markdown parsing errors
- Verify highlight.js CSS is loaded in index.css
- Test with simple markdown first before complex formatting

## Support

For issues and questions:
- Check existing GitHub issues for similar problems
- Create a new issue with detailed description and steps to reproduce
- Include error messages and browser console output
- Provide browser version and operating system information
- Include screenshots for UI-related issues
