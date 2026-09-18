-- ====================================================================
-- V7__add_default_portal_to_users.sql
-- Add domain-level default portal column to users table with
-- institution-scoped authoritative storage.
-- ====================================================================

ALTER TABLE users ADD COLUMN default_portal_id VARCHAR(32);
