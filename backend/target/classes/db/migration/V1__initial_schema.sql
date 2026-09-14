-- ====================================================================
-- V1__initial_schema.sql
-- Complete PostgreSQL Normalized Enterprise Schema for College ERP
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. INSTITUTIONS & HIERARCHY
-- --------------------------------------------------------------------
CREATE TABLE institutions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(64) NOT NULL,
    motto VARCHAR(255),
    registration_number VARCHAR(128) UNIQUE,
    accreditation_body VARCHAR(128) DEFAULT 'TVETA',
    primary_color VARCHAR(32) DEFAULT '#2563eb',
    currency VARCHAR(16) DEFAULT 'KES',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    version BIGINT DEFAULT 0
);

CREATE TABLE campuses (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    director_name VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

CREATE TABLE departments (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    hod_name VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

CREATE TABLE academic_years (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL, -- e.g. 2025/2026
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

CREATE TABLE academic_terms (
    id VARCHAR(64) PRIMARY KEY,
    academic_year_id VARCHAR(64) NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    term_name VARCHAR(64) NOT NULL, -- Term 1, Term 2, Term 3
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'UPCOMING', -- UPCOMING, ACTIVE, COMPLETED
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 2. USERS, ROLES, PERMISSIONS & AUTHENTICATION
-- --------------------------------------------------------------------
CREATE TABLE permissions (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    description VARCHAR(255),
    category VARCHAR(64) NOT NULL
);

CREATE TABLE roles (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    code VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(255),
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

CREATE TABLE role_permissions (
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    identifier VARCHAR(128) NOT NULL, -- Admission No, Staff ID, or Unique ID
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    campus_id VARCHAR(64) REFERENCES campuses(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, INACTIVE, ON_LEAVE
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(institution_id, identifier),
    UNIQUE(institution_id, email)
);

CREATE TABLE user_roles (
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    campus_scope VARCHAR(64),
    department_scope VARCHAR(64),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------------------
-- 3. STUDENTS, PROGRAMS & ENROLLMENT
-- --------------------------------------------------------------------
CREATE TABLE programs (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(64) NOT NULL, -- CERTIFICATE, DIPLOMA, HIGHER_DIPLOMA
    duration_semesters INT DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

CREATE TABLE courses (
    id VARCHAR(64) PRIMARY KEY,
    program_id VARCHAR(64) NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credit_hours INT DEFAULT 3,
    semester INT DEFAULT 1,
    lecturer_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    campus_id VARCHAR(64) NOT NULL REFERENCES campuses(id) ON DELETE RESTRICT,
    program_id VARCHAR(64) NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    admission_number VARCHAR(64) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(16),
    national_id VARCHAR(64),
    birth_date DATE,
    phone_number VARCHAR(32),
    email VARCHAR(255),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(32),
    current_term_id VARCHAR(64) REFERENCES academic_terms(id),
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, DEFERRED, GRADUATED
    fee_balance NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(institution_id, admission_number)
);

CREATE TABLE course_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    academic_term_id VARCHAR(64) NOT NULL REFERENCES academic_terms(id) ON DELETE RESTRICT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(32) DEFAULT 'ENROLLED', -- ENROLLED, DROPPED, COMPLETED
    UNIQUE(student_id, course_id, academic_term_id)
);

CREATE TABLE attendance_sessions (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lecturer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    session_date DATE NOT NULL,
    session_token VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_records (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'PRESENT', -- PRESENT, ABSENT, EXCUSED
    UNIQUE(session_id, student_id)
);

-- --------------------------------------------------------------------
-- 4. ADMISSIONS
-- --------------------------------------------------------------------
CREATE TABLE applications (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    reference_number VARCHAR(64) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    national_id VARCHAR(64),
    program_id VARCHAR(64) NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    kcse_mean_grade VARCHAR(8),
    kcse_index_number VARCHAR(64),
    application_fee_paid BOOLEAN DEFAULT FALSE,
    fee_reference VARCHAR(64),
    status VARCHAR(32) DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, ADMITTED
    reviewer_notes TEXT,
    reviewed_by VARCHAR(64) REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(institution_id, reference_number)
);

-- --------------------------------------------------------------------
-- 5. ACADEMICS, ASSESSMENTS & RESULTS
-- --------------------------------------------------------------------
CREATE TABLE assessments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_term_id VARCHAR(64) NOT NULL REFERENCES academic_terms(id) ON DELETE RESTRICT,
    title VARCHAR(128) NOT NULL,
    type VARCHAR(32) NOT NULL, -- CAT_1, CAT_2, PRACTICAL, MAIN_EXAM
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 30.00,
    weight_percentage NUMERIC(5, 2) NOT NULL DEFAULT 30.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_marks (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    entered_by VARCHAR(64) NOT NULL REFERENCES users(id),
    status VARCHAR(32) DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, MODERATED, APPROVED, PUBLISHED
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, student_id)
);

CREATE TABLE result_amendments (
    id VARCHAR(64) PRIMARY KEY,
    student_mark_id VARCHAR(64) NOT NULL REFERENCES student_marks(id) ON DELETE CASCADE,
    previous_score NUMERIC(5, 2) NOT NULL,
    new_score NUMERIC(5, 2) NOT NULL,
    reason TEXT NOT NULL,
    requested_by VARCHAR(64) NOT NULL REFERENCES users(id),
    approved_by VARCHAR(64) REFERENCES users(id),
    status VARCHAR(32) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 6. FINANCE, INVOICES & PAYMENTS (M-PESA)
-- --------------------------------------------------------------------
CREATE TABLE fee_structures (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    program_id VARCHAR(64) NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    academic_term_id VARCHAR(64) NOT NULL REFERENCES academic_terms(id) ON DELETE RESTRICT,
    tuition_amount NUMERIC(12, 2) NOT NULL,
    exam_fee NUMERIC(12, 2) DEFAULT 0.00,
    activity_fee NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    invoice_number VARCHAR(64) NOT NULL,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    academic_term_id VARCHAR(64) NOT NULL REFERENCES academic_terms(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) DEFAULT 0.00,
    balance NUMERIC(12, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID, CANCELLED
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(institution_id, invoice_number)
);

CREATE TABLE payments (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    invoice_id VARCHAR(64) REFERENCES invoices(id) ON DELETE SET NULL,
    receipt_number VARCHAR(64) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(32) NOT NULL, -- MPESA, BANK_TRANSFER, CASH, CHEQUE
    transaction_reference VARCHAR(128) NOT NULL,
    payer_phone VARCHAR(32),
    payer_name VARCHAR(128),
    status VARCHAR(32) DEFAULT 'SUCCESS', -- INITIATED, PENDING, SUCCESS, FAILED, REVERSED
    allocated_to_fee BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, transaction_reference)
);

CREATE TABLE mpesa_transactions (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(id),
    invoice_id VARCHAR(64) REFERENCES invoices(id),
    merchant_request_id VARCHAR(128) NOT NULL,
    checkout_request_id VARCHAR(128) NOT NULL UNIQUE,
    phone_number VARCHAR(32) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    account_reference VARCHAR(64) NOT NULL,
    transaction_code VARCHAR(64),
    status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, TIMEOUT
    result_code VARCHAR(32),
    result_desc VARCHAR(255),
    callback_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 7. AUDIT LOGS (IMMUTABLE DATABASE RECORD)
-- --------------------------------------------------------------------
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    actor_id VARCHAR(64) NOT NULL,
    actor_identifier VARCHAR(128),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(128) NOT NULL,
    resource_id VARCHAR(128),
    status VARCHAR(32) DEFAULT 'SUCCESS', -- SUCCESS, DENIED, FAILED
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    request_id VARCHAR(128),
    details TEXT,
    previous_state JSONB,
    new_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_institution ON audit_logs(institution_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- --------------------------------------------------------------------
-- 8. DOCUMENTS & VERIFICATION
-- --------------------------------------------------------------------
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL, -- TRANSCRIPT, RECEIPT, ADMISSION_LETTER, CLEARANCE_CERT
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_key VARCHAR(255) NOT NULL UNIQUE,
    file_size BIGINT,
    mime_type VARCHAR(128) DEFAULT 'application/pdf',
    hash_sha256 VARCHAR(128),
    verification_code VARCHAR(64) NOT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(64) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 9. NOTIFICATIONS
-- --------------------------------------------------------------------
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
