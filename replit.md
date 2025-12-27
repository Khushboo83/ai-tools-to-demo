# replit.md

## Overview

A full-stack Todo application built with React frontend and Express backend. The app provides a clean, modern task management interface with real-time updates, dark/light theme support, and smooth animations. Data is persisted using PostgreSQL via Drizzle ORM with a RESTful API architecture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom development plugins for Replit integration
- **Styling**: Tailwind CSS with CSS variables for theming (dark/light mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with TSX for development, esbuild for production
- **API Design**: RESTful endpoints under `/api/` prefix
- **Static Serving**: Express serves built frontend assets in production

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Generated to `./migrations` directory via `drizzle-kit push`

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI components including shadcn/ui
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── static.ts     # Static file serving
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared code between frontend/backend
│   └── schema.ts     # Drizzle database schema
└── script/           # Build scripts
```

### Build System
- **Development**: `npm run dev` runs TSX with Vite middleware for HMR
- **Production**: `npm run build` bundles frontend with Vite and backend with esbuild
- **Output**: `dist/` contains `index.cjs` (server) and `public/` (frontend assets)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Key NPM Packages
- **drizzle-orm / drizzle-kit**: Database ORM and migration tooling
- **@tanstack/react-query**: Async state management and data fetching
- **framer-motion**: Animation library for React
- **Radix UI**: Headless UI component primitives (accordion, dialog, dropdown, etc.)
- **class-variance-authority / clsx / tailwind-merge**: Styling utilities

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TSX**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements