-- ====================================================================
-- V9__portal_assignment_integrity_and_inquiries.sql
-- Enforces:
-- 1. Database-level invariant: exactly one active default portal per user and institution.
-- 2. Persistence table for public administrative and admissions inquiries.
-- ====================================================================

-- 1. Partial Unique Index: A user can have at most one active default portal per institution.
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_portal_assignments_one_active_default
ON user_portal_assignments(user_id, institution_id)
WHERE active = TRUE AND is_default = TRUE;

-- 2. Public Inquiries Table for verified contact form submissions
CREATE TABLE IF NOT EXISTS public_inquiries (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    department VARCHAR(64) NOT NULL DEFAULT 'ADMISSIONS',
    subject VARCHAR(256) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    reference_number VARCHAR(64) NOT NULL UNIQUE,
    client_ip VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_public_inquiries_email ON public_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_public_inquiries_dept ON public_inquiries(department);
CREATE INDEX IF NOT EXISTS idx_public_inquiries_created_at ON public_inquiries(created_at);
