# PaikarMart — Multi-Vendor eCommerce Platform (Bangladesh)

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Auth: `src/middleware/auth.ts` — `requireAuth`, `requireSeller`, `requireAdmin` middleware (x-user-id header → DB lookup → role check)
- Depends on: `@workspace/db`, `@workspace/api-zod`, `zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.mjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

**Phase 2 API Routes (May 2026):**

Original routes (unchanged, no auth guards yet — Phase 3):
`health`, `products`, `sellers`, `orders`, `users`, `notifications`, `admin`, `auth`

New Phase 2 routes (all with inline Zod validation):
- `GET /transactions?user_id=&type=` — list wallet transactions; `POST /transactions` (requireAuth) — create & update wallet balance
- `GET /reviews?product_id=&vendor_id=&user_id=` — list reviews; `GET /reviews/:id`; `POST /reviews` (requireAuth) — auto-updates product avg rating; `DELETE /reviews/:id` (own or admin)
- `GET /disputes` (requireAuth) — list; `POST /disputes` (requireAuth) — create; `GET /disputes/:id` (requireAuth, owner/admin); `PUT /disputes/:id/status` (requireAdmin) — resolve
- `GET /kyc` (requireSeller) — list seller docs; `POST /kyc` (requireSeller) — submit doc; `PUT /kyc/:id/review` (requireAdmin) — approve/reject
- `GET /commissions` — public list; `GET /commissions/:seller_type` — single; `PUT /commissions/:seller_type` (requireAdmin) — update rate
- `GET /milestones/:seller_id` (requireAuth); `POST /milestones` (requireAdmin) — create; `PUT /milestones/:seller_id/progress` (requireAdmin) — bulk update
- `GET /affiliate` (requireAuth) — list user links; `POST /affiliate` (requireAuth) — create with auto-generated code; `GET /affiliate/track/:code` — public click tracker

**Auth middleware pattern:** `x-user-id` header → DB user lookup → role assertion. Frontend must send header on authenticated requests. Existing routes NOT yet guarded (backward-compatible). Phase 3 will add JWT + guard existing admin/seller routes.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- `migrations/phase1_down.sql` — reversible down-migration for Phase 1 changes
- Exports: `.` (pool, db, schema), `./schema` (schema only)

**Phase 1 DB Schema (May 2026) — 13 tables total:**

Original 6 tables (unchanged):
- `users` — +`otp_verified` (bool, nullable), +`moderator` role in enum
- `sellers` — +`kyc_status` (text, nullable), +`commission_rate` (real, nullable), +4 new seller types in enum
- `orders` — +`cancel_reason` (text, nullable), +`refund_status` (text, nullable); JSONB `items` untouched
- `products`, `notifications`, `wallets` — unchanged

New Phase 1 tables (all nullable-safe):
- `transactions` — proper wallet transaction ledger (parallel to JSONB, non-replacing)
- `reviews` — product reviews with verified-purchase flag
- `disputes` — order dispute tracking with resolution workflow
- `kyc_documents` — seller KYC document upload & review
- `commissions_config` — per-seller-type commission % (pre-seeded 10 rows)
- `milestones` — seller achievement milestones
- `affiliate_links` — referral/affiliate code tracking

New enums: `transaction_type`, `transaction_status`, `dispute_type`, `dispute_status`, `kyc_doc_type`, `kyc_doc_status`, `milestone_type`, `affiliate_target_type`
Extended enums: `seller_type` (+b2b_seller, content_creator, logistic_courier, booking_agent), `user_role` (+moderator)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

### `artifacts/paikarmart` (`@workspace/paikarmart`)

React + Vite frontend. Dark-themed Bangladesh-focused multi-vendor marketplace.

**Design tokens**: bg `hsl(160 28% 5%)`, primary `hsl(145 65% 38%)`, purple `hsl(265 55% 58%)`. CSS utilities: `.glass`, `.glass-card`, `.glow-green`, `.text-gradient-green`.

**UI Audit complete (May 2026) — all pages dark glassmorphism:**
- `orders/index.tsx` — filter tabs (All/Pending/Shipped/Delivered/Cancelled) + GlassCard order list + empty state
- `notifications.tsx` — filter tabs + GlassCard divided list, unread dot, type icons (order/delivery/account/seller)
- `faq.tsx` — hero + search + accordion categories (General/Buying/Selling/Account) + contact CTA
- `terms.tsx` — hero + collapsible section accordion + date footer
- `admin/dashboard.tsx` — 4 stat cards + seller applications panel + recent orders panel + mobile quick-nav
- `register.tsx` — 3-step registration (info → OTP 6-digit → done/welcome)
- STATUS_CONFIG in all pages: dark `bg-yellow-500/15 text-yellow-400` etc. (no more `bg-yellow-100 text-yellow-700`)
- BUSINESS_TYPES in `seller/register.tsx`: dark selection colors (`bg-orange-500/10 text-orange-400`)
- Profile toggle: `bg-white/10` unchecked, `bg-emerald-500` checked (was `bg-gray-200`/`bg-green-600`)

**Responsive desktop layouts (completed):**
- `index.tsx` — custom layout with CompactHeader + SideDrawer; 2-col desktop (feed + right sidebar with categories/trending shops/trust/app promo)
- `feed.tsx` — 2-col desktop (posts + right sidebar: browse categories/trending shops/app promo)
- `vendors/[id].tsx` — vendor storefront with desktop left sidebar (shop info/stats/contact/hours) + 4-tab main content
- `products/index.tsx` — dark glassmorphism; desktop left filter sidebar (category/price range/vendor type/in-stock toggle) + 4-col product grid with active filter chips
- `vendors/index.tsx` — dark glassmorphism; stats banner (4 tiles) + filter chips (All/Wholesale/Retail/Brand/Local/Service) + search + 4-col vendor cards with rating/sales stats
- `cart.tsx` — dark glassmorphism; 2-col desktop (items left + sticky order summary/promo code/trust badges right)
- `checkout.tsx` — dark glassmorphism; 2-col desktop (delivery info/delivery type/payment method left + sticky order summary right)
- `categories.tsx` — dark glassmorphism; hero banner + product category grid + shop-by-type (4 tiles) + trending sections (3-col banners) + popular search tags
- `login.tsx` — dark glassmorphism; role tabs (Customer/Seller/Admin) + OTP/password/forgot flows + demo quick-login buttons
- `products/[id].tsx` — dark glassmorphism; 2-col desktop (image gallery left + product info/price/features/CTA right) + tabs (Description/Specifications/Reviews)
- `profile.tsx` — desktop left sidebar nav + main content area (dashboard/orders/wishlist/reviews/wallet/settings tabs)

**Key directories:**
- `src/pages/` — route-level pages (products, cart, checkout, orders, vendors, feed, categories, profile, wallet, notifications, faq, terms)
- `src/pages/seller/` — seller sub-pages (dashboard, products, product-form, profile, verification, analytics, orders, register)
- `src/pages/admin/` — admin sub-pages (dashboard, settings, registry, changes, users)
- `src/seller/` — SellerContext (local state, seed data) + types
- `src/context/` — WishlistContext, LocationContext, PKCoinContext, VideoUnlockContext
- `src/config/` — feature.flags.ts, delivery.config.ts, profitShare.config.ts, payment.config.ts
- `src/features/registry/aiLogger.ts` — localStorage-backed admin change log
- `src/hooks/` — useAuth (null default, clears "user-1"/"guest" legacy data), useCart
- `src/components/ui/GlassCard.tsx` — shared glass-morphism card with optional hoverEffect
- `src/lib/format.ts` — formatBDT, discountPercent utils
- `src/routes/index.tsx` — AppRouter with RequireAuth/RequireSeller/RequireAdmin guards

**Auth note:** `use-auth.tsx` clears legacy fake user IDs ("user-1", "guest") from localStorage on load. Default user is `null` (not logged in). Login page has quick demo buttons for Buyer/Seller/Admin roles.

**Footer:** desktop-only; mobile uses BottomNav with `pb-20`.

**Seller pages:** Use SellerContext (local state, no backend yet). SellerContext is seeded with 3 sample products and 4 sample orders. Phase 3 will migrate to real API calls.

**CategoryListResponse** shape: `{ categories: Category[] }` — always destructure `.categories` before mapping.

**Pre-existing TypeScript issues (safe to ignore):**
- `TS6305` — lib dist files not built (resolved at runtime by Vite)
- `TS7006` — implicit `any` in older pages (pre-existing)
