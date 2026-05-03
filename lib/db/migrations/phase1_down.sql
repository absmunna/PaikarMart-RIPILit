-- ============================================================
-- PaikarMart Phase 1 — DOWN Migration (Rollback Script)
-- ============================================================
-- Run this script to UNDO all Phase 1 schema changes.
-- This will DROP all new tables and REMOVE all new columns.
-- WARNING: This is DESTRUCTIVE. All data in new tables will be lost.
-- The original 6 tables (users, sellers, products, orders,
-- notifications, wallets) will be restored to pre-Phase-1 state.
-- ============================================================

BEGIN;

-- ----------------------------------------------------------------
-- 1. Drop new tables (Phase 1 additions — safe to drop entirely)
-- ----------------------------------------------------------------
DROP TABLE IF EXISTS affiliate_links CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS commissions_config CASCADE;
DROP TABLE IF EXISTS kyc_documents CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- ----------------------------------------------------------------
-- 2. Drop new enums (Phase 1 additions)
-- ----------------------------------------------------------------
DROP TYPE IF EXISTS affiliate_target_type CASCADE;
DROP TYPE IF EXISTS milestone_type CASCADE;
DROP TYPE IF EXISTS kyc_doc_status CASCADE;
DROP TYPE IF EXISTS kyc_doc_type CASCADE;
DROP TYPE IF EXISTS dispute_status CASCADE;
DROP TYPE IF EXISTS dispute_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;

-- ----------------------------------------------------------------
-- 3. Remove new nullable columns from orders table
-- ----------------------------------------------------------------
ALTER TABLE orders
  DROP COLUMN IF EXISTS cancel_reason,
  DROP COLUMN IF EXISTS refund_status;

-- ----------------------------------------------------------------
-- 4. Remove new nullable columns from sellers table
-- ----------------------------------------------------------------
ALTER TABLE sellers
  DROP COLUMN IF EXISTS kyc_status,
  DROP COLUMN IF EXISTS commission_rate;

-- ----------------------------------------------------------------
-- 5. Remove new nullable column from users table
-- ----------------------------------------------------------------
ALTER TABLE users
  DROP COLUMN IF EXISTS otp_verified;

-- ----------------------------------------------------------------
-- 6. Revert enum extensions
-- NOTE: PostgreSQL does NOT support removing enum values directly.
-- The safest approach is to recreate the enum if needed.
-- Since the new values (b2b_seller, content_creator, etc.) are
-- additive and no existing rows use them, the original code
-- will still function correctly even if enum values remain.
-- To fully revert seller_type enum, recreate it:
-- ----------------------------------------------------------------

-- Recreate seller_type without Phase 1 additions
ALTER TYPE seller_type RENAME TO seller_type_old;
CREATE TYPE seller_type AS ENUM (
  'wholesaler', 'retailer', 'brand_seller', 'local_shop', 'dropship', 'service'
);
ALTER TABLE sellers
  ALTER COLUMN business_type TYPE seller_type
  USING business_type::text::seller_type;
DROP TYPE seller_type_old;

-- Recreate user_role without 'moderator'
ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
ALTER TABLE users
  ALTER COLUMN role TYPE user_role
  USING role::text::user_role;
DROP TYPE user_role_old;

COMMIT;

-- ================================================================
-- Verification query (run after rollback to confirm state):
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' ORDER BY table_name;
-- Expected: affiliate_links, commissions_config, disputes,
--           kyc_documents, milestones, reviews, transactions
--           should NOT appear.
-- ================================================================
