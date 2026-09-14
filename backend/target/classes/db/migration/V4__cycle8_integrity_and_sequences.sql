-- ====================================================================
-- V4__cycle8_integrity_and_sequences.sql
-- Financial integrity, atomic admission sequence generator,
-- account activation tokens, and M-Pesa state persistence.
-- ====================================================================

-- 1. ADMISSION NUMBER SEQUENCES (Database-backed, institution-scoped, year-scoped)
CREATE TABLE IF NOT EXISTS admission_sequences (
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    academic_year INT NOT NULL,
    last_value BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (institution_id, academic_year)
);

-- 2. STUDENT ACCOUNT ACTIVATION TOKENS (Secure hashed tokens)
CREATE TABLE IF NOT EXISTS account_activation_tokens (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_activation_token_hash ON account_activation_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_activation_user_id ON account_activation_tokens(user_id);

-- 3. M-PESA PERSISTENCE BEFORE EXTERNAL CALL
-- Allow temporary nullable checkout_request_id & merchant_request_id during INITIATING state
ALTER TABLE mpesa_transactions ALTER COLUMN checkout_request_id DROP NOT NULL;
ALTER TABLE mpesa_transactions ALTER COLUMN merchant_request_id DROP NOT NULL;

-- Ensure indexes for fast lookup and idempotency
CREATE INDEX IF NOT EXISTS idx_mpesa_tx_status ON mpesa_transactions(status);
CREATE INDEX IF NOT EXISTS idx_mpesa_receipt_num ON mpesa_transactions(mpesa_receipt_number);

-- 4. HARDEN HOSTEL BED ALLOCATION CONSTRAINT
-- Prevent active double-allocation of same bed in same academic term
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_bed_term ON hostel_allocations (bed_id, academic_term_id) 
WHERE status = 'ACTIVE';

-- 5. LIBRARY COPY CONCURRENCY LOCK HELPER
CREATE INDEX IF NOT EXISTS idx_book_copy_borrowable ON book_copies(id, status);

-- 6. CAMPUS IS_ACTIVE FLAG
ALTER TABLE campuses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

