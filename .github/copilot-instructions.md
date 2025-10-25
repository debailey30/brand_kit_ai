# Brand Kit AI — Copilot Instructions (condensed)

Concise, project-specific guidance to help AI coding agents be productive immediately in this repo.

## Architecture at a glance
- Monorepo
  - `client/` React 18 + Vite + Tailwind + Radix/shadcn (path aliases: `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`)
  - `server/` Express (TypeScript, ESM) with routes grouped by resource in `server/routes.ts`
  - `shared/` Drizzle ORM schema + Zod schemas/types used on both sides (`shared/schema.ts`)
- Key integrations
  - Auth: Replit OIDC via `server/replitAuth.ts` (session store in Postgres `sessions` table)
  - Payments: Stripe (API version 2025-09-30.clover) webhooks handled in `server/routes.ts`
  - AI: OpenAI Images API model `gpt-image-1` in `server/imageGeneration.ts` (aspect ratio → size mapping)
  - Storage: S3-compatible Replit Object Storage in `server/objectStorage.ts` (dev fallback `server/localStorage.ts` exists but not used by default)

## How it runs
- Dev: `npm run dev` launches Express on port 5000 with Vite in middleware mode serving `client/index.html` (see `server/vite.ts`, `server/index.ts`).
- Build: `npm run build` → Vite builds client to `dist/public`, esbuild bundles server to `dist/index.js`.
- Start: `npm run start` runs Node on `dist/index.js` and serves static from `dist/public`.
- DB migrations: `npm run db:push` syncs `shared/schema.ts` to the Neon Postgres database (see `drizzle.config.ts`).

## Data model essentials (`shared/schema.ts`)
- Core tables: `users`, `subscriptions` (tier/quota), `brandKits` + `brandKitAssets`, `generations`, `templates` (+ `templateVariants`, `templateControls`, `templateCustomizations`, `templatePurchases`, `templateBundles`).
- Zod schemas: exported via `createInsertSchema`; server validates request bodies with these.

## Critical server patterns (`server/`)
- Route groups in `routes.ts`:
  - `/api/auth/*` (Replit OIDC login/callback/logout, `isAuthenticated` refreshes tokens when expired)
  - `/api/subscription/*` (Stripe checkout/portal, webhook endpoint requires raw body from `server/index.ts`)
  - `/api/brand-kits/*`, `/api/generations*`, `/api/templates*`
- Quota enforcement: free tier limited by `subscriptions.generationsUsed/Limit` before calling `generateImage()`.
- Image generation flow: build enhanced prompt (template variant + customizations) → OpenAI `gpt-image-1` → optional watermark for free tier (`server/watermark.ts`) → save via `ObjectStorageService` → persist with `storage.createGeneration()`.
- Storage layer: use `server/storage.ts` `DatabaseStorage` methods (e.g., `getUser`, `createGeneration`, `getTemplates`) instead of raw queries.

## Frontend conventions (`client/`)
- Data fetching: TanStack Query with a default `queryFn` that fetches with `credentials: "include"` and `staleTime: Infinity` (`client/src/lib/queryClient.ts`). Use query keys like `["/api/resource"]`.
- Auth: `useAuth()` treats 401 as unauthenticated (does not throw) and returns `{ isAuthenticated }`.
- Routing: Wouter; main composition in `client/src/App.tsx` with `ThemeProvider`, `TooltipProvider`, `Toaster`.
- UI examples: `client/src/components/examples/*` provide reference usage for shared components.

## Environment variables (required)
- Database/Auth: `DATABASE_URL`, `SESSION_SECRET`, `PORT` (default 5000)
- OpenAI: `OPENAI_API_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, `STRIPE_PRICE_ID_ENTERPRISE`, `STRIPE_WEBHOOK_SECRET`
- Replit OIDC: `REPLIT_DOMAINS`, `REPL_ID`, `ISSUER_URL`
- Object Storage (if enabled): `REPLIT_OBJECT_STORAGE_ENDPOINT`, `REPLIT_OBJECT_STORAGE_*`

## Gotchas and tips
- Keep query keys absolute (e.g., `["/api/subscription"]`) to align with the default `queryFn`.
- Stripe webhooks require raw body capture (`req.rawBody` set in `server/index.ts`). Don’t add body parsers before that middleware.
- Use Drizzle condition builders (`eq`, `and`, etc.)—don’t compare with `===` in query expressions.
- Free-tier watermarking is tier-based; don’t bypass `hasWatermark` when persisting generations.
- Static serving in prod reads from `dist/public`; ensure `vite.config.ts` `outDir` remains in sync with server static path logic.

## Quick references
- Dev logger: `server/vite.ts::log()` formats `[HH:MM:SS AM/PM] [source] msg`.
- Seeding templates: run `tsx server/seedTemplates.ts` locally if needed.
- Session store: Postgres `sessions` table (do not drop; required for auth flows).

# Brand Kit AI - Copilot Instructions

## Project Overview
Full-stack SaaS platform for AI-powered brand asset generation with a marketplace for template trading. Built with React/TypeScript frontend, Express backend, PostgreSQL (Neon), and integrated with OpenAI, Stripe, and Replit Auth.

## Architecture

### Monorepo Structure
- **`client/`** - React 18 + Vite frontend with shadcn/ui components
- **`server/`** - Express.js API with TypeScript (ESM modules)
- **`shared/`** - Shared Drizzle schema and Zod validators used by both client and server

### Key Technology Stack
- **Database**: Neon Serverless PostgreSQL with Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect) via `server/replitAuth.ts`
- **Payments**: Stripe API v2025-09-30.clover for subscriptions
- **AI**: OpenAI DALL-E via `server/imageGeneration.ts`
- **Storage**: Replit Object Storage (S3-compatible) via `server/objectStorage.ts`
- **State**: TanStack Query (React Query) with aggressive caching (`staleTime: Infinity`)
- **Routing**: Wouter for lightweight client-side routing
- **UI**: Radix UI primitives + shadcn/ui + Tailwind CSS

## Data Model (shared/schema.ts)

### Core Entities
1. **Users & Subscriptions**: Three-tier model (free/pro/enterprise) with quota enforcement
2. **Brand Kits**: User collections of colors, fonts, and uploaded assets
3. **Generations**: AI-generated image history linked to brand kits/templates
4. **Templates**: Marketplace items with variants, controls, and customizations
   - **Variants**: Different sizes/formats (e.g., Instagram Story 1080x1920, Post 1080x1080)
   - **Controls**: Dynamic form inputs (color/font/text/number/select/toggle)
   - **Customizations**: User-saved configurations for templates

### Important Relationships
- Templates → Variants (one-to-many for different sizes)
- Templates → Controls (define customization UI)
- Generations → Templates + Variants + Customizations (track template-based generation)
- Users → Template Purchases (20% platform fee, 80% creator earnings)

## Critical Patterns

### Authentication Flow
```typescript
// server/replitAuth.ts handles OIDC with token refresh
// Middleware: isAuthenticated checks session + refreshes tokens
// User creation: upsertUser() on every login to sync profiles
// Sessions stored in PostgreSQL with 7-day TTL
```

### Subscription Quota Enforcement
```typescript
// Check tier before generation (server/routes.ts ~L400)
if (subscription.tier === "free" && subscription.generationsUsed >= subscription.generationsLimit) {
  return res.status(403).json({ quotaExceeded: true });
}
```

### Stripe Webhooks
- `checkout.session.completed` → Update subscription tier
- `customer.subscription.updated/deleted` → Handle cancellations
- Raw body preservation required: `req.rawBody` in `server/index.ts`

### Template System
Templates support dynamic customization via Controls:
```typescript
// Controls define form fields (color picker, font selector, etc.)
// TemplateCustomizationForm (client) builds Zod schema from controls
// Customizations JSON stored in generations for reproducibility
// Image generation enhances prompts with variant metadata + customizations
```

### Image Generation & Watermarking
- Free tier: Images watermarked via `server/watermark.ts`, stored in `public/`
- Pro/Enterprise: Unwatermarked, stored in `.private/` with presigned URLs
- Aspect ratios mapped: `1:1 → 1024x1024`, `16:9 → 1792x1024`, `9:16 → 1024x1792`

## Development Workflows

### Commands
```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Build client (Vite) + server (esbuild)
npm run start        # Production mode
npm run db:push      # Push Drizzle schema to database
```

### Path Aliases
- `@/` → `client/src/` (used in imports like `@/components/ui/button`)
- `@shared/` → `shared/` (for schema types)

### Database Migrations
- Use `npm run db:push` to sync `shared/schema.ts` with Neon database
- Schema changes auto-generate TypeScript types via Drizzle
- Mandatory tables: `sessions`, `users` (required by Replit Auth)

### Adding New Template Controls
1. Define control in `templateControls` table with `controlType` enum
2. `TemplateCustomizationForm` dynamically builds Zod schema + UI
3. Supported types: `color`, `font`, `text`, `number`, `select`, `toggle`
4. Controls have `minValue`/`maxValue` for number validation

### Route Organization (server/routes.ts)
Routes grouped by resource with comments:
- Auth routes (`/api/auth/*`)
- Subscription routes (`/api/subscription/*`)
- Brand kit routes (`/api/brand-kits/*`)
- Generation routes (`/api/generate`)
- Template routes (`/api/templates/*`)
- Template variants/controls/customizations as nested resources

## Important Conventions

### Error Handling
- Client: React Query with `throwOnError` configured in `client/src/lib/queryClient.ts`
- Server: Consistent JSON error responses with `message` field
- 401 handling: Special case in `useAuth` hook to avoid throwing

### Validation
- All request bodies validated with Zod schemas from `shared/schema.ts`
- Use `insertXSchema.omit({ id: true, createdAt: true })` pattern
- Server-side: `parse()` throws on invalid data

### Storage Abstraction
- `server/storage.ts` implements `IStorage` interface
- All database operations go through `DatabaseStorage` class
- Pattern: `storage.getUser()`, `storage.createGeneration()`, etc.

### Frontend Queries
```typescript
// Standard query pattern
const { data, isLoading } = useQuery<Type>({
  queryKey: ["/api/resource"],
  // Default queryFn uses fetch with credentials
});

// Mutations with optimistic updates
const mutation = useMutation({
  mutationFn: () => apiRequest("POST", "/api/resource", data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/resource"] }),
});
```

### Environment Variables
Required in `.env`:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, `STRIPE_PRICE_ID_ENTERPRISE`
- `STRIPE_WEBHOOK_SECRET` - For webhook signature verification
- `REPLIT_DOMAINS`, `REPL_ID`, `ISSUER_URL` - For Replit Auth
- `REPLIT_OBJECT_STORAGE_ENDPOINT`, `REPLIT_OBJECT_STORAGE_*` - For S3 storage

## Testing Patterns
- Component examples in `client/src/components/examples/` demonstrate usage
- Use `data-testid` attributes for UI components (e.g., `data-testid="badge-popular-pro"`)

## Common Pitfalls
- Don't forget to check subscription tier before operations (brand kit creation, template publishing)
- Always validate template ownership (`template.creatorId === userId`) before modifications
- Watermark enforcement is tier-based, not request-based
- Use `eq()` from drizzle-orm for WHERE clauses, not `===`
- Frontend routing: Authenticated users see different routes (see `client/src/App.tsx`)
