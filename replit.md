# Interval Timer Application

## Overview

This is a full-stack interval timer web application built with React and Express.js. The application is designed to run 4 sequential intervals of 2 hours and 15 minutes each, featuring custom audio alarms, visual progress tracking, and a modern UI built with shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom timer and audio management hooks
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but minimal schema)
- **Session Management**: Express sessions with PostgreSQL store
- **API Structure**: RESTful API with `/api` prefix (routes not yet implemented)

### Development Environment
- **Runtime**: Node.js 20
- **Package Manager**: npm
- **TypeScript**: Full TypeScript support across client and server
- **Development Server**: Vite dev server with HMR integration

## Key Components

### Timer System
- **Core Logic**: Custom `useTimer` hook managing interval state, timing, and completion tracking
- **Flexible Configuration**: Customizable intervals (1-10) and durations (1-480 minutes)
- **Preset Durations**: Pomodoro (25min), 30min, 45min, 1h, 1.5h, 2h, 2h15min (default)
- **State Management**: Tracks current interval, time remaining, completion status, and total elapsed time
- **Settings Persistence**: Timer settings update immediately with validation
- **Persistence**: Currently in-memory (ready for database integration)

### Audio System
- **Custom Audio Support**: File upload for custom alarm sounds
- **Web Audio API**: Browser-based audio playback with AudioContext
- **Audio Controls**: Test, play, and stop functionality
- **File Support**: Accepts various audio formats through HTML5 file input

### User Interface
- **Timer Display**: Large digital clock showing remaining time in HH:MM:SS format
- **Progress Visualization**: Progress bar and status dots showing interval completion
- **Control Interface**: Play/pause and reset buttons with Material Icons
- **Settings Panel**: Dialog for customizing timer duration and interval count
- **History Tracking**: Visual display of completed intervals with timestamps
- **Theme Toggle**: Light/dark mode with Nothing OS aesthetics
- **AdSense Integration**: Minimal banner advertising for monetization
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Basic user table defined (username/password fields)
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Migration Support**: Drizzle Kit for database migrations

## Data Flow

1. **Timer Initialization**: Component mounts and initializes timer state
2. **User Interaction**: Play/pause/reset actions update timer state through hooks
3. **Interval Processing**: Timer hook manages countdown and interval transitions
4. **Audio Triggers**: Interval completion triggers custom audio alarm
5. **State Updates**: React state updates drive UI re-renders
6. **Persistence**: Timer state could be persisted to database (not yet implemented)

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for modern icons
- Material Icons for timer controls

### Development Tools
- Vite for build tooling and development server
- TypeScript for type safety
- ESBuild for server-side bundling
- Replit-specific plugins for development environment integration

### Audio and Media
- Web Audio API (native browser support)
- HTML5 File API for audio uploads
- Date-fns for time formatting utilities

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Port 5000 mapped to external port 80
- **Hot Reload**: Vite HMR with runtime error overlay

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built client files
- **Deployment Target**: Replit Autoscale deployment

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Management**: PostgreSQL-based session store
- **Asset Handling**: Static file serving with cache headers

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Added Nothing OS aesthetics with monochromatic design and signature red accent
- June 25, 2025. Implemented dark/light theme toggle functionality
- June 25, 2025. Added Google AdSense integration with minimal banner
- June 25, 2025. Implemented custom timer settings (duration and interval count)
- June 25, 2025. Enhanced timer flexibility with preset and custom durations
- June 25, 2025. Fixed custom timer settings bug - timer now respects user-selected durations
- June 25, 2025. Fixed file upload button visibility with improved layout design
- June 25, 2025. Fixed JavaScript errors in timer state management
- June 25, 2025. PROJECT COMPLETED - All features working correctly
- June 25, 2025. Integrated real AdSense credentials (ca-pub-6627209561720449, slot: 9591460073)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```