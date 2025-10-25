# Brand Kit AI - Professional Brand Assets Generator

## Overview

Brand Kit AI is a SaaS platform that enables users to generate professional brand assets using AI-powered image generation. The application follows a freemium business model with tiered subscriptions (Free, Pro, Enterprise) and includes a marketplace where users can buy and sell brand templates. The platform is built as a full-stack application with React frontend, Express backend, and PostgreSQL database, utilizing Replit's built-in services for authentication, object storage, and AI integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and modern development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing without the overhead of React Router
- TanStack Query (React Query) for server state management, caching, and data synchronization

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, tooltips, etc.)
- shadcn/ui component library using the "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Custom HSL-based color system supporting light/dark themes with CSS variables
- Inter font family from Google Fonts for consistent typography

**State Management Strategy**
- Server state managed by TanStack Query with aggressive caching (staleTime: Infinity)
- Authentication state derived from `/api/auth/user` endpoint query
- Local component state using React hooks (useState, useEffect)
- Theme state persisted to localStorage with context provider

**Design System Principles**
- Card-based layouts inspired by Linear and Notion for clean information hierarchy
- Consistent spacing using Tailwind's 4px-based scale (2, 4, 6, 8, 12, 16, 20, 24)
- Responsive grid layouts with breakpoints for mobile, tablet, and desktop
- Hover and active states with elevation changes for interactive feedback

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server with TypeScript
- ESM modules throughout the codebase for modern JavaScript standards
- Custom request logging middleware tracking API response times and payloads
- Vite integration in development mode for SSR and HMR support

**Authentication System**
- Replit Auth using OpenID Connect (OIDC) for passwordless authentication
- Passport.js strategy for session management
- PostgreSQL-backed session store (connect-pg-simple) with 7-day TTL
- Session cookies with httpOnly and secure flags for security
- Mandatory users and sessions tables for Replit Auth compliance

**API Design Pattern**
- RESTful endpoints organized by resource (`/api/subscription`, `/api/brand-kits`, `/api/generate`)
- Consistent error handling with JSON error responses
- Authentication middleware (`isAuthenticated`) protecting private routes
- Request body parsing with raw body preservation for Stripe webhooks

**Business Logic Layers**
- Storage abstraction (IStorage interface) separating database operations from routes
- Image generation service wrapping OpenAI API calls with quota checking
- Watermark service for free-tier generated images
- Stripe integration service for subscription checkout and webhook handling

### Data Storage Solutions

**Database: PostgreSQL via Neon Serverless**
- Drizzle ORM for type-safe database queries and schema migrations
- WebSocket-based connection pooling for serverless environments
- Schema-first approach with TypeScript types generated from database schema

**Core Data Models**
1. **Users**: Stores user profiles from Replit Auth (id, email, name, profile image)
2. **Subscriptions**: Tracks user tier (free/pro/enterprise), Stripe IDs, generation quotas, and renewal dates
3. **Brand Kits**: User-created collections of brand assets with colors, fonts, and style preferences
4. **Brand Kit Assets**: Individual files uploaded to brand kits (logos, fonts, reference images)
5. **Generations**: History of AI-generated images with prompts, settings, and URLs
6. **Templates**: User-published templates available in the marketplace
7. **Template Purchases**: Transaction records linking buyers to purchased templates

**Object Storage: Replit Object Storage (S3-compatible)**
- AWS SDK for S3 integration with Replit's endpoint
- Public path (`public/generations/`) for watermarked free-tier images
- Private path (`.private/generations/`) for premium unwatermarked images
- Presigned URLs for temporary access to private files
- Base64 to buffer conversion for AI-generated images

**Data Access Patterns**
- User subscription checked on every generation request for quota enforcement
- Brand kits queried by userId with eager loading of related assets
- Generation history paginated and sorted by creation date (DESC)
- Templates filtered by category with creator information joined

### External Dependencies

**AI Services**
- OpenAI API via Replit AI Integrations for DALL-E image generation
- Configured to use `gpt-5` model (latest as of August 2025)
- Custom prompt enhancement combining user input with style directives
- Aspect ratio mapping to OpenAI's supported sizes (1024x1024, 1792x1024, 1024x1792)

**Payment Processing**
- Stripe API v2025-09-30.clover for subscription billing
- Checkout Sessions for subscription upgrades (Free → Pro → Enterprise)
- Webhook handling for subscription lifecycle events (created, updated, canceled)
- Customer portal for self-service subscription management

**Authentication Provider**
- Replit Auth as the identity provider with OIDC discovery
- Automatic user creation/update on login with profile synchronization
- Session management with automatic expiration and renewal
- Logout flow clearing both application and provider sessions

**Development Tools**
- Replit-specific Vite plugins (runtime error overlay, cartographer, dev banner)
- TypeScript compiler with strict mode and path aliases (@/, @shared/)
- Drizzle Kit for database schema migrations (`npm run db:push`)
- ESBuild for production server bundling

**Font & UI Assets**
- Google Fonts CDN for Inter typeface (weights: 400, 500, 600, 700)
- Local image assets in `attached_assets/generated_images/` for mockups and examples
- Favicon served from public directory

**Monitoring & Error Handling**
- Custom logger formatting timestamps in 12-hour format with source labels
- React Query error boundaries with 401 handling for authentication failures
- Toast notifications (shadcn/ui) for user-facing success/error messages
- Console error logging for server-side exceptions