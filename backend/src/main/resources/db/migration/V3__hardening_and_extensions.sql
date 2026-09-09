-- ====================================================================
-- V3__hardening_and_extensions.sql
-- Hardening schema: Password Reset Tokens, Financial Ledger, Allocations,
-- Receipts, M-Pesa tracking, LMS, Library, Hostel, HR, Procurement
-- ====================================================================

-- 1. PASSWORD RESET TOKENS (Secure, short-lived, single-use)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_token ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_expires ON password_reset_tokens(expires_at);

-- 2. FINANCE AUTHORITATIVE LEDGER, ALLOCATIONS & RECEIPTS
CREATE TABLE IF NOT EXISTS payment_allocations (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    payment_id VARCHAR(64) NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    invoice_id VARCHAR(64) NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    allocated_amount NUMERIC(12, 2) NOT NULL CHECK (allocated_amount > 0),
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64) REFERENCES users(id),
    UNIQUE(payment_id, invoice_id)
);
CREATE INDEX IF NOT EXISTS idx_alloc_payment ON payment_allocations(payment_id);
CREATE INDEX IF NOT EXISTS idx_alloc_invoice ON payment_allocations(invoice_id);

CREATE TABLE IF NOT EXISTS financial_ledger (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    entry_type VARCHAR(32) NOT NULL, -- INVOICE_CHARGE, PAYMENT_CREDIT, REFUND_DEBIT, REVERSAL_DEBIT, WAIVER_CREDIT
    reference_id VARCHAR(64) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    running_balance NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ledger_student ON financial_ledger(student_id);
CREATE INDEX IF NOT EXISTS idx_ledger_institution ON financial_ledger(institution_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created ON financial_ledger(created_at);

CREATE TABLE IF NOT EXISTS receipts (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    payment_id VARCHAR(64) NOT NULL REFERENCES payments(id) ON DELETE RESTRICT UNIQUE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(64) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    issued_by VARCHAR(64) REFERENCES users(id),
    qr_code_hash VARCHAR(255),
    is_cancelled BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_receipt_student ON receipts(student_id);
CREATE INDEX IF NOT EXISTS idx_receipt_number ON receipts(receipt_number);

-- Ensure M-Pesa columns and indexes exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mpesa_transactions' AND column_name='mpesa_receipt_number') THEN
        ALTER TABLE mpesa_transactions ADD COLUMN mpesa_receipt_number VARCHAR(64);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mpesa_transactions' AND column_name='transaction_date') THEN
        ALTER TABLE mpesa_transactions ADD COLUMN transaction_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_mpesa_checkout ON mpesa_transactions(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_student ON mpesa_transactions(student_id);

-- 3. LIBRARY SUBSYSTEM
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    isbn VARCHAR(32),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(128),
    category VARCHAR(64),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    shelf_location VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_books_institution ON books(institution_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

CREATE TABLE IF NOT EXISTS book_copies (
    id VARCHAR(64) PRIMARY KEY,
    book_id VARCHAR(64) NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    barcode VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(32) DEFAULT 'AVAILABLE' -- AVAILABLE, BORROWED, RESERVED, LOST, MAINTENANCE
);

CREATE TABLE IF NOT EXISTS borrow_records (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    copy_id VARCHAR(64) NOT NULL REFERENCES book_copies(id) ON DELETE RESTRICT,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    borrowed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    returned_at TIMESTAMP WITH TIME ZONE,
    fine_amount NUMERIC(8, 2) DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'ACTIVE' -- ACTIVE, RETURNED, OVERDUE, LOST
);
CREATE INDEX IF NOT EXISTS idx_borrow_user ON borrow_records(user_id);
CREATE INDEX IF NOT EXISTS idx_borrow_copy ON borrow_records(copy_id);

-- 4. HOSTEL SUBSYSTEM
CREATE TABLE IF NOT EXISTS hostels (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    campus_id VARCHAR(64) REFERENCES campuses(id) ON DELETE SET NULL,
    name VARCHAR(128) NOT NULL,
    gender_policy VARCHAR(16) NOT NULL, -- MALE, FEMALE, MIXED
    capacity INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hostel_rooms (
    id VARCHAR(64) PRIMARY KEY,
    hostel_id VARCHAR(64) NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    room_number VARCHAR(32) NOT NULL,
    floor VARCHAR(16),
    capacity INT NOT NULL DEFAULT 4,
    UNIQUE(hostel_id, room_number)
);

CREATE TABLE IF NOT EXISTS hostel_beds (
    id VARCHAR(64) PRIMARY KEY,
    room_id VARCHAR(64) NOT NULL REFERENCES hostel_rooms(id) ON DELETE CASCADE,
    bed_number VARCHAR(16) NOT NULL,
    status VARCHAR(32) DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED, MAINTENANCE
    UNIQUE(room_id, bed_number)
);

CREATE TABLE IF NOT EXISTS hostel_allocations (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    bed_id VARCHAR(64) NOT NULL REFERENCES hostel_beds(id) ON DELETE RESTRICT,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    academic_term_id VARCHAR(64) NOT NULL REFERENCES academic_terms(id) ON DELETE RESTRICT,
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, CHECKED_OUT, CANCELLED
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    checked_out_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_hostel_alloc_student ON hostel_allocations(student_id);

-- 5. HR SUBSYSTEM
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    staff_number VARCHAR(64) NOT NULL,
    job_title VARCHAR(128) NOT NULL,
    employment_type VARCHAR(32) DEFAULT 'PERMANENT',
    salary_scale VARCHAR(32),
    basic_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, staff_number)
);
CREATE INDEX IF NOT EXISTS idx_emp_institution ON employees(institution_id);

CREATE TABLE IF NOT EXISTS leave_requests (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(32) NOT NULL, -- ANNUAL, SICK, MATERNITY, PATERNITY, COMPASSIONATE
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    reviewed_by VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payroll_batches (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    month_year VARCHAR(16) NOT NULL,
    total_gross NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_net NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'DRAFT', -- DRAFT, APPROVED, DISBURSED
    processed_by VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, month_year)
);

-- 6. PROCUREMENT SUBSYSTEM
CREATE TABLE IF NOT EXISTS procurement_requisitions (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    requisition_number VARCHAR(64) NOT NULL UNIQUE,
    department_id VARCHAR(64) REFERENCES departments(id),
    requested_by VARCHAR(64) NOT NULL REFERENCES users(id),
    item_description TEXT NOT NULL,
    estimated_cost NUMERIC(12, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, PO_ISSUED
    approved_by VARCHAR(64) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id VARCHAR(64) PRIMARY KEY,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    po_number VARCHAR(64) NOT NULL UNIQUE,
    requisition_id VARCHAR(64) REFERENCES procurement_requisitions(id),
    vendor_name VARCHAR(128) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'ISSUED', -- ISSUED, FULFILLED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. LMS SUBSYSTEM
CREATE TABLE IF NOT EXISTS lms_modules (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lms_lessons (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) NOT NULL REFERENCES lms_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    duration_minutes INT DEFAULT 45,
    order_index INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lms_assignments (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_points NUMERIC(5, 2) DEFAULT 100.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lms_submissions (
    id VARCHAR(64) PRIMARY KEY,
    assignment_id VARCHAR(64) NOT NULL REFERENCES lms_assignments(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score NUMERIC(5, 2),
    graded_by VARCHAR(64) REFERENCES users(id),
    feedback TEXT,
    status VARCHAR(32) DEFAULT 'SUBMITTED', -- SUBMITTED, GRADED, LATE
    UNIQUE(assignment_id, student_id)
);
