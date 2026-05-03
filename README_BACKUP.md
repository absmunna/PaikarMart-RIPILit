# PaikarMart — Pre-Phase 1 Backup Snapshot

**Backup Created:** 2026-05-03  
**Backup File:** `paikarmart_pre_phase1_backup.tar.gz` (96MB)  
**Git Branch:** main  
**Node:** 24.13.0 | pnpm monorepo | PostgreSQL + Drizzle ORM

---

## Current System State

### Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Wouter routing |
| UI | Radix UI + Tailwind CSS + dark glassmorphism theme |
| Backend | Express 5 + TypeScript (ESM, esbuild) |
| Database | PostgreSQL + Drizzle ORM |
| API Contract | OpenAPI 3.0 → Orval codegen → TanStack Query hooks |
| Monorepo | pnpm workspaces |

### Registered Services
| Service | Port | Status |
|---------|------|--------|
| API Server (`@workspace/api-server`) | 8080 | ✅ Running |
| Frontend (`@workspace/paikarmart`) | dynamic | ✅ Running |
| Mockup Sandbox | 8081 | ✅ Running |

### Shared Libraries
| Package | Purpose |
|---------|---------|
| `@workspace/db` | Drizzle schema + DB connection |
| `@workspace/api-spec` | openapi.yaml (990 lines) |
| `@workspace/api-zod` | Auto-generated Zod schemas from OpenAPI |
| `@workspace/api-client-react` | Auto-generated TanStack Query hooks + customFetch |

---

## Database Schema (Current)

| Table | Columns | Notes |
|-------|---------|-------|
| `users` | id, name, phone, email, role, district, area, created_at | roles: buyer/seller/admin |
| `sellers` | id, shopName, businessType, status, phone, email, address, location, district, rating, totalProducts, totalSales, image, description, deliveryTypes[], coverageAreas[] | |
| `products` | id, name, category, subcategory, type, price, costPrice, stock, moq, description, images[], vendorId, vendorName, location, rating, reviewCount, priceOnInquiry, inStock, deliveryDays, created_at | |
| `orders` | id, userId, items(JSONB), status, deliveryType, paymentMethod, totalAmount, deliveryCharge, trackingCode, customerName, customerPhone, customerAddress, district, area, estimatedDelivery, created_at, updated_at | |
| `wallets` | userId, balance, totalEarned, investmentValue, transactions(JSONB) | |
| `notifications` | id, userId, type, title, message, read, created_at | |

### Seed Data
- 10 users (1 admin, 5 sellers, 4 buyers)
- 5 sellers (Rahman Electronics, Dhaka Fashion House, CTG Wholesale Hub, Sylhet Organic Farm, Rajshahi Mango Mart)
- 20 products across Electronics, Fashion, Grocery, Services
- 4 orders with correct customer data
- 3 wallets with transactions
- 4 notifications

---

## API Endpoints (All Validated ✅)

| Method | Endpoint | Status |
|--------|----------|--------|
| POST | /api/auth/login | ✅ |
| POST | /api/auth/register | ✅ |
| GET | /api/products | ✅ |
| GET | /api/products/featured | ✅ |
| GET | /api/products/categories | ✅ |
| GET | /api/products/:id | ✅ |
| GET | /api/sellers | ✅ |
| GET | /api/sellers/:id | ✅ |
| GET | /api/sellers/:id/products | ✅ |
| POST | /api/sellers/:id/register | ✅ |
| PUT | /api/sellers/:id/approve | ✅ |
| GET | /api/sellers/:id/dashboard | ✅ (fixed) |
| GET | /api/orders | ✅ (seller_id filter added) |
| POST | /api/orders | ✅ |
| GET | /api/orders/:id | ✅ |
| PUT | /api/orders/:id/status | ✅ |
| GET | /api/users/:id | ✅ |
| GET | /api/users/:id/wallet | ✅ |
| GET | /api/notifications | ✅ |
| PUT | /api/notifications/:id/read | ✅ |
| GET | /api/admin/dashboard | ✅ |
| GET | /api/admin/market-stats | ✅ |

---

## Frontend Pages (Implemented)

| Page | Route | Auth Guard |
|------|-------|------------|
| Home | / | Public |
| Products | /products | Public |
| Product Detail | /products/:id | Public |
| Cart | /cart | Public |
| Wishlist | /wishlist | Public |
| Login | /login | Public |
| Register | /register | Public |
| Buyer Orders | /orders | RequireAuth |
| Buyer Profile | /profile | RequireAuth |
| Notifications | /notifications | RequireAuth |
| FAQ | /faq | Public |
| Terms | /terms | Public |
| Seller Register | /seller/register | RequireAuth |
| Seller Dashboard | /seller/dashboard | RequireSeller |
| Seller Products | /seller/products | RequireSeller |
| Seller Orders | /seller/orders | RequireSeller |
| Seller Profile | /seller/profile | RequireSeller |
| Admin Dashboard | /admin/dashboard | RequireAdmin |

---

## Feature Flags & Configs

| Config | File | Status |
|--------|------|--------|
| Feature flags | `src/config/features.config.ts` | ✅ Active |
| Payment config | `src/config/payment.config.ts` | ✅ Configured (bKash, Nagad, COD) |
| Delivery config | `src/config/delivery.config.ts` | ✅ 4 delivery types |
| Profit share | `src/config/profitShare.config.ts` | ✅ PKCoin system config |
| Product types | `src/config/productTypes.config.ts` | ✅ physical/digital/service |

---

## Fixes Applied in This Audit Session

### Critical Fixes
| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `lib/db/seed.ts` | Orders used wrong field `address` instead of `customerAddress` | Fixed field names: customerName, customerPhone, customerAddress, district added to all 4 orders |
| 2 | `lib/db/seed.ts` | Wallet transaction `type: "withdrawal"` not in OpenAPI enum | Changed to `type: "adjustment"` |
| 3 | `lib/db/seed.ts` | Order items missing `subtotal` and `vendorName` fields | Added subtotal + vendorName to all order items |
| 4 | `artifacts/api-server/src/routes/orders.ts` | `seller_id` filter declared in OpenAPI but not implemented | Implemented JSONB containment query: `items @> [{vendorId}]::jsonb` |
| 5 | `artifacts/api-server/src/routes/orders.ts` | `cancelReason` field referenced but column doesn't exist in DB | Removed reference |
| 6 | `artifacts/api-server/src/routes/admin.ts` | Same `cancelReason` reference bug | Removed reference |
| 7 | `artifacts/api-server/src/routes/sellers.ts` | `normalizeOrder` too simple — missing item normalization and optional field handling | Full rewrite: added `normalizeOrderItem`, proper null→undefined conversion for all optional fields |
| 8 | DB (psql) | Old seed data in live DB with wrong field names | Direct SQL UPDATE to fix existing records |

---

## Known Limitations (To Be Fixed in Phase 1+)

### 🔴 Critical Architecture Gaps
| # | Issue | Phase |
|---|-------|-------|
| 1 | **SellerContext** is 100% local state (localStorage) — no backend API connection | Phase 3 |
| 2 | **Auth** is localStorage-only — no JWT tokens, no session management | Phase 2 |
| 3 | **Wallet transactions** stored in JSONB — not a proper queryable table | Phase 1 |
| 4 | **Admin/Seller API endpoints** have no server-side auth middleware | Phase 2 |

### 🟡 Medium Issues
| # | Issue | Phase |
|---|-------|-------|
| 5 | **Seller dashboard** O(n) query: loads ALL orders then filters in JS | Phase 2 |
| 6 | **WishlistContext** is localStorage-only | Phase 3 |
| 7 | **PKCoinContext** is localStorage-only (frontend wallet simulation) | Phase 3 |
| 8 | Auth response format is `{user: {...}}` — frontend should handle properly | Phase 2 |

### ❌ Missing Tables (Phase 1 Will Add)
- `kyc_documents` — KYC verification system
- `reviews` — Product reviews & ratings
- `transactions` — Proper wallet transaction table (replace JSONB)
- `disputes` — Order dispute system
- `commissions_config` — Commission rules per seller type
- `milestones` — Seller milestone tracking
- `affiliate_links` — Affiliate/referral system

### ❌ Missing Seller Types
Current: `wholesaler | retailer | brand_seller | local_shop | dropship | service`  
Missing: `b2b_seller | content_creator | logistic_courier | booking_agent`

### ❌ Missing Roles
Current: `buyer | seller | admin`  
Missing: `moderator`

### ❌ Missing Systems
- Real payment gateway (bKash API, Nagad API, SSLCommerz)
- Escrow system
- Real-time notifications (WebSocket/SSE)
- Image upload (CDN)
- SMS OTP verification
- Rate limiting & API security

---

## Next Phase: Phase 1 — Database Schema Upgrade

### Objective
Add all missing tables and columns to PostgreSQL without breaking existing functionality.

### Tables to Add
1. `kyc_documents` (sellerId, type, fileUrl, status, reviewedBy, reviewedAt)
2. `reviews` (id, productId, userId, orderId, rating, comment, createdAt)
3. `transactions` (id, userId, type, amount, description, referenceId, createdAt)
4. `disputes` (id, orderId, userId, type, status, description, resolution, createdAt)
5. `commissions_config` (id, sellerType, percent, minPercent, maxPercent, updatedAt)
6. `milestones` (id, sellerId, type, target, current, achieved, achievedAt)
7. `affiliate_links` (id, userId, code, targetId, type, clicks, conversions, createdAt)

### Columns to Add to Existing Tables
- `orders.cancel_reason` (text, nullable)
- `orders.refund_status` (enum: pending/partial/full, nullable)
- `sellers.kyc_status` (enum: not_submitted/pending/approved/rejected)
- `sellers.commission_rate` (numeric, nullable)
- `users.otp_verified` (boolean, default false)

### Safety Rules for Phase 1
- All new columns must be nullable or have defaults
- No existing column drops or renames
- Run migration as additive-only
- Test with existing seed data after migration

---

## Backup Contents

```
paikarmart_pre_phase1_backup.tar.gz (96MB)
├── artifacts/
│   ├── api-server/          # Express 5 backend
│   ├── paikarmart/          # React + Vite frontend
│   └── mockup-sandbox/      # Component preview server
├── lib/
│   ├── api-spec/            # openapi.yaml (990 lines)
│   ├── api-client-react/    # Generated TanStack Query hooks
│   ├── api-zod/             # Generated Zod schemas
│   └── db/                  # Drizzle schema + seed.ts
├── package.json             # pnpm workspace root
├── pnpm-workspace.yaml
└── tsconfig*.json
```

*Excluded: node_modules/, dist/, build/, .cache/, .git/*

---

**Prepared by:** Senior Audit Agent  
**Status:** SAFE TO PROCEED TO PHASE 1 ✅
