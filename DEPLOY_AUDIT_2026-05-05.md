# Deployment Readiness Audit — 2026-05-05

## Verdict
**Not deployment-ready yet.**

## What was checked
1. Workspace-level TypeScript validation (`pnpm run typecheck`).
2. Authentication and request security approach in API middleware.
3. High-level Express runtime hardening defaults.

## Blocking issues

### 1) TypeScript build is currently broken (hard blocker)
Running `pnpm run typecheck` fails in shared library `lib/api-zod` due to ambiguous duplicate exports.

- `lib/api-zod/src/index.ts` re-exports both `./generated/api` and `./generated/types`.
- Compiler error indicates duplicate symbols such as `CreateOrderBody` and `UpdateOrderStatusBody`.
- This blocks CI and production build pipelines that depend on typecheck/build.

### 2) Authentication mechanism is not production-safe (hard blocker)
`artifacts/api-server/src/middleware/auth.ts` authenticates by trusting an inbound `x-user-id` header and then loading that user from DB. This permits identity spoofing by clients if no trusted gateway strips/sets that header.

### 3) API hardening baseline is incomplete (near-blocker)
`artifacts/api-server/src/app.ts` does not currently show standard hardening middleware such as:
- Helmet/security headers
- Request rate limiting
- Explicit CORS origin restrictions

For public deployment, these should be treated as required before go-live.

## Recommended go-live gate (must pass)
- [ ] `pnpm run typecheck`
- [ ] `pnpm run build`
- [ ] Auth migrated to signed tokens/session (JWT or equivalent) with server-side verification
- [ ] Rate limiting + strict CORS allowlist + security headers
- [ ] Environment secrets validated and production configs reviewed

## Suggested immediate fixes
1. Resolve duplicate exports in `lib/api-zod/src/index.ts` (explicit exports instead of wildcard collisions).
2. Replace `x-user-id` trust flow with real auth (bearer token + signature verification).
3. Add middleware for security headers and rate limiting.
4. Re-run typecheck/build as release gate.

