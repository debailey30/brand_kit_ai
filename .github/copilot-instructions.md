# Brand Kit AI — Copilot Instructions (condensed)

Concise, project-specific guidance to help AI coding agents be productive immediately in this repo.

## Architecture at a glance
- Monorepo
  - `client/` React 18 + Vite + Tailwind + Radix/shadcn (path aliases: `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`)
  - `server/` Express (TypeScript, ESM) with routes grouped by resource in `server/routes.ts`
  - `shared/` Drizzle ORM schema + Zod schemas/types used on both sides (`shared/schema.ts`)
- Key integrations
- Auth: Local passport strategy via `server/auth.ts` (session store in memory for dev)
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
- Stripe webhooks require raw body capture (`req.rawBody` set in `server/index.ts`). Don't add body parsers before that middleware.
- Use Drizzle condition builders (`eq`, `and`, etc.)—don't compare with `===` in query expressions.
- Free-tier watermarking is tier-based; don't bypass `hasWatermark` when persisting generations.
- Static serving in prod reads from `dist/public`; ensure `vite.config.ts` `outDir` remains in sync with server static path logic.

## Quick references
- Dev logger: `server/vite.ts::log()` formats `[HH:MM:SS AM/PM] [source] msg`.
- Seeding templates: run `tsx server/seedTemplates.ts` locally if needed.
- Session store: Postgres `sessions` table (<attempt_completion>
<result>Updated the copilot instructions to reflect the current authentication system using local passport strategy instead of Replit OIDC.</result>
