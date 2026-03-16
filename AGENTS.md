# Kartika AI Frontend

This is the frontend application for Kartika AI, a web-based AI chat interface with dashboard management capabilities. The project is built with Next.js, React, and TypeScript.

## Project Overview

**Kartika AI** is an AI-powered chat application that provides:
- Real-time streaming chat interface with AI models
- Knowledge base management for RAG (Retrieval-Augmented Generation)
- Smart search functionality with customizable search engines
- User account and role management dashboard
- AI model management and configuration
- Multi-theme support (Light, Dark, Nord, Dracula, Solarized, Monokai)
- Font customization (Geist, Inter)

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.0.3 (App Router) |
| React | 19.2.0 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui + Radix UI |
| State Management | Zustand |
| Animation | Framer Motion |
| Icons | Lucide React |
| Forms/Validation | Zod |
| Notifications | Sonner |
| Package Manager | Bun (with npm fallback) |

## Project Structure

```
app/                          # Next.js App Router
├── (ai-dashboard-layout)/    # Route group: Dashboard layout
│   └── dashboard/
│       ├── account/          # Account management pages
│       ├── ai/               # AI management pages
│       │   ├── knowledge/    # Knowledge base management
│       │   ├── manage/       # AI configuration
│       │   ├── overview/     # AI stats overview
│       │   └── smartsearch/  # Smart search configuration
│       └── overview/         # Dashboard overview
├── (chat-layout)/            # Route group: Chat layout
│   ├── chat/                 # Chat interface
│   │   └── [id]/             # Dynamic conversation page
│   ├── knowledge/            # Knowledge base view
│   ├── search/               # Smart search interface
│   └── settings/             # User settings
├── layout.tsx                # Root layout
├── page.tsx                  # Landing page
└── globals.css               # Global styles with themes

components/
├── chat/                     # Chat-related components
│   ├── conversations/        # Conversation list management
│   ├── files/                # File upload and display
│   ├── input/                # Chat input components
│   ├── layout/               # Chat layout components
│   ├── parameter/            # Parameter settings UI
│   └── prompt/               # Prompt management UI
├── dashboard/                # Dashboard components
│   ├── ai/                   # AI management UI
│   ├── layout/               # Dashboard layout
│   ├── overview/             # Overview data tables
│   └── user/                 # User management UI
├── knowledge/                # Knowledge base components
├── search/                   # Smart search components
├── ui/                       # shadcn/ui base components
└── utils/                    # Utility components (theme, toasters)

lib/
├── api/                      # API client functions
│   ├── chat.ts               # Chat streaming API
│   ├── conversations.ts      # Conversation CRUD
│   ├── files.ts              # File upload API
│   ├── models.ts             # AI model API
│   ├── prompt.ts             # System prompt API
│   ├── rag.ts                # RAG/knowledge base API
│   └── smartsearch.ts        # Smart search API
├── config/
│   └── constants.ts          # App constants (file limits, etc.)
├── store/                    # Zustand stores
│   ├── conversation_store.ts
│   ├── message_store.ts
│   ├── knowledge-store.ts
│   ├── prompt_store.ts
│   ├── rag_store.ts
│   ├── smartsearch_store.ts
│   ├── error_store.ts
│   ├── success_store.ts
│   └── theme_store.ts
├── type/                     # TypeScript types
│   ├── chat_message.ts
│   ├── conversation.ts
│   ├── knowledge.ts
│   ├── model.ts
│   ├── prompt_type.ts
│   ├── smartsearch.ts
│   └── user.ts
├── utils.ts                  # Utility functions
└── validator/                # Zod schemas
    ├── chat/
    └── smartsearch-schema/

hooks/                        # Custom React hooks
├── useChat.ts                # Main chat logic
├── useConversation.ts        # Conversation management
├── usePrompt.ts              # Prompt management
├── useRag.ts                 # RAG operations
├── useSmartsearch.ts         # Smart search operations
├── useError.ts               # Error handling
├── useSuccess.ts             # Success notifications
├── useTheme.ts               # Theme management
├── useDebounce.ts            # Debounce utility
└── use-mobile.ts             # Mobile detection

public/                       # Static assets
├── logo.png
├── dark-logo.png
├── light-logo.png
└── opusai_logo_transparent.svg
```

## Build and Development Commands

```bash
# Development server
bun dev
# or: npm run dev

# Production build
bun run build
# or: npm run build

# Start production server
bun start
# or: npm start

# Linting
bun lint
# or: npm run lint
```

The development server runs on `http://localhost:3000` by default.

## Environment Variables

Create a `.env` file based on `.env.template`:

```bash
# Required: Backend API base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Note: The backend URL must be provided at build time for Docker builds
# using --build-arg NEXT_PUBLIC_BASE_URL="<backend_url>"
```

**Important**: `NEXT_PUBLIC_*` variables are embedded at build time and cannot be changed at runtime.

## Code Style Guidelines

### Formatting and Linting

This project uses **Biome** as the primary formatter and linter:

- **Indentation**: Tab (not spaces)
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Line width**: Default (80 characters)
- **Import organization**: Enabled via Biome assist

Configuration is in `biome.json`.

**ESLint** is used for Next.js-specific rules via `eslint-config-next`.

### Running Code Quality Checks

```bash
# Format and lint with Biome
npx @biomejs/biome check --write .

# Or just check without writing
npx @biomejs/biome check .

# ESLint
bun lint
```

### TypeScript Conventions

- Use strict TypeScript mode (`strict: true` in tsconfig.json)
- Prefer explicit return types for exported functions
- Use path aliases (`@/*`) for imports
- All components use `.tsx` extension

### Component Patterns

- Functional components with hooks
- Use `cn()` utility from `lib/utils.ts` for conditional class merging
- Client components marked with `"use client"` directive
- Server components used by default where possible

## Testing Instructions

This project does not currently have automated tests configured. To add testing:

1. Install testing dependencies:
   ```bash
   bun add -d vitest @testing-library/react @testing-library/jest-dom
   ```

2. Create test files alongside components with `.test.tsx` extension

3. Run tests:
   ```bash
   bun test
   ```

## Deployment

### Docker Deployment

A multi-stage Dockerfile is provided using Bun:

```bash
# Build the Docker image
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL="<backend_url>" \
  -t kartika-ai-frontend .

# Run the container
docker run -d -p 3000:3000 kartika-ai-frontend
```

**Build-time Environment Variables**: Since Next.js embeds `NEXT_PUBLIC_*` variables at build time, you must pass them as build args when building the Docker image.

### Standalone Output

The Next.js config (`next.config.ts`) uses `output: "standalone"` for optimized Docker deployments. This creates a minimal server bundle in `.next/standalone/`.

## Key Architecture Decisions

### State Management

- **Zustand** is used for global state (conversations, messages, themes)
- Server state is fetched via custom hooks that interact with API functions
- No React Query/SWR - manual fetching with useEffect patterns

### API Communication

- Chat uses **Server-Sent Events (SSE)** for streaming responses
- REST API for CRUD operations
- File uploads use multipart/form-data

### Route Groups

- `(chat-layout)` - Chat interface with collapsible sidebar
- `(ai-dashboard-layout)` - Dashboard with nested navigation

### Theming

- CSS variables with OKLCH color space
- Multiple theme classes applied to `<html>` element
- Theme state persisted in localStorage
- Font switching between Geist and Inter

### File Upload Constraints

Defined in `lib/config/constants.ts`:
- Max file size: 5MB for chat, 10MB for knowledge base insertion
- Max files per upload: 3 files
- Allowed types: PDF, DOC, DOCX, TXT, MD

## Security Considerations

1. **XSS Prevention**: 
   - `dangerouslySetInnerHTML` is used for theme initialization script (marked with Biome ignore)
   - React Markdown is used for rendering AI responses safely

2. **Environment Variables**:
   - Never commit `.env` files
   - Use `.env.template` for documentation
   - `NEXT_PUBLIC_*` vars are client-exposed by design

3. **File Upload**:
   - MIME type validation on client
   - Size limits enforced
   - Server should perform additional validation

4. **CORS**:
   - Frontend expects backend at `NEXT_PUBLIC_BASE_URL`
   - Configure CORS on backend appropriately

## Git Hooks

Git hooks are located in `.githooks/`:
- `prepare-commit-msg`: Applies commit message template from `.commit_template.txt` if it exists

To enable git hooks:
```bash
git config core.hooksPath .githooks
```

## Dependencies to Know

| Package | Purpose |
|---------|---------|
| `@base-ui/react` | Base UI components |
| `@radix-ui/*` | Headless UI primitives |
| `@tanstack/react-table` | Data tables |
| `class-variance-authority` | Component variant management |
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| `nanoid` | UUID generation |
| `next-themes` | Theme management |
| `nextjs-toploader` | Page load progress bar |
| `react-markdown` | Markdown rendering |
| `rehype-highlight` | Code syntax highlighting |
| `remark-gfm` | GitHub-flavored markdown |
| `sonner` | Toast notifications |
| `zod` | Schema validation |
| `zustand` | State management |

## Common Development Tasks

### Adding a New API Endpoint

1. Create function in `lib/api/<feature>.ts`
2. Define types in `lib/type/<feature>.ts`
3. Create/update hook in `hooks/use<Feature>.ts`
4. Use in components

### Adding a New Theme

1. Add theme class to `app/globals.css` with OKLCH color variables
2. Add theme option to theme store
3. Update `ThemeToggle` component if needed

### Adding shadcn/ui Components

```bash
npx shadcn add <component-name>
```

Components are installed to `components/ui/`.

### Modifying Tailwind Config

Tailwind CSS v4 uses CSS-based configuration in `app/globals.css`:
- Use `@theme inline` for custom properties
- Custom variants with `@custom-variant`
- Plugins with `@plugin`
