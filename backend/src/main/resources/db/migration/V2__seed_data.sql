-- ====================================================================
-- V2__seed_data.sql
-- Synthetic Enterprise Development Seed Data (Strictly synthetic data)
-- ====================================================================

-- 1. Default Institution
INSERT INTO institutions (id, name, short_name, motto, registration_number, accreditation_body, primary_color, currency)
VALUES (
    'inst_apex_tvet',
    'Apex National Polytechnic',
    'Apex Poly',
    'Skill, Innovation and Technical Excellence',
    'TVETA/PUB/2021/045',
    'TVETA',
    '#0284c7',
    'KES'
) ON CONFLICT (id) DO NOTHING;

-- Campuses
INSERT INTO campuses (id, institution_id, code, name, location, director_name)
VALUES
    ('cmp_main', 'inst_apex_tvet', 'MAIN', 'Main Campus (Nairobi)', 'Upper Hill Tech Corridor', 'Prof. David Mutua'),
    ('cmp_western', 'inst_apex_tvet', 'WEST', 'Western Campus (Kisumu)', 'Lake Basin Innovation Hub', 'Dr. Grace Otieno')
ON CONFLICT DO NOTHING;

-- Departments
INSERT INTO departments (id, institution_id, code, name, hod_name)
VALUES
    ('dept_comp', 'inst_apex_tvet', 'CS_IT', 'Computing & Informatics', 'Eng. Patrick Mwangi'),
    ('dept_eng', 'inst_apex_tvet', 'ENG', 'Electrical & Electronic Engineering', 'Dr. Beatrice Koech'),
    ('dept_biz', 'inst_apex_tvet', 'BIZ', 'Business & Entrepreneurship Studies', 'Mr. Samuel Omondi')
ON CONFLICT DO NOTHING;

-- Academic Years & Terms
INSERT INTO academic_years (id, institution_id, code, start_date, end_date, is_current)
VALUES
    ('ay_2025_2026', 'inst_apex_tvet', '2025/2026', '2025-09-01', '2026-08-31', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO academic_terms (id, academic_year_id, institution_id, term_name, start_date, end_date, status, is_active)
VALUES
    ('term_2026_1', 'ay_2025_2026', 'inst_apex_tvet', 'Term 1 (Sep - Dec 2025)', '2025-09-01', '2025-12-15', 'COMPLETED', FALSE),
    ('term_2026_2', 'ay_2025_2026', 'inst_apex_tvet', 'Term 2 (Jan - Apr 2026)', '2026-01-05', '2026-04-10', 'ACTIVE', TRUE),
    ('term_2026_3', 'ay_2025_2026', 'inst_apex_tvet', 'Term 3 (May - Aug 2026)', '2026-05-04', '2026-08-14', 'UPCOMING', FALSE)
ON CONFLICT DO NOTHING;

-- 2. Permissions
INSERT INTO permissions (id, code, description, category)
VALUES
    ('p_usr_view', 'USER_VIEW', 'View institutional users', 'SECURITY'),
    ('p_usr_edit', 'USER_EDIT', 'Create and edit users', 'SECURITY'),
    ('p_stu_view', 'STUDENT_VIEW', 'View student registries and profiles', 'STUDENTS'),
    ('p_stu_edit', 'STUDENT_EDIT', 'Manage student records and admissions', 'STUDENTS'),
    ('p_mark_enter', 'MARK_ENTER', 'Enter continuous assessment scores', 'ACADEMICS'),
    ('p_mark_mod', 'MARK_MODERATE', 'Moderate course grade returns', 'ACADEMICS'),
    ('p_mark_appr', 'MARK_APPROVE', 'Approve official term marks', 'ACADEMICS'),
    ('p_res_pub', 'RESULT_PUBLISH', 'Publish official transcripts', 'ACADEMICS'),
    ('p_fin_inv', 'INVOICE_CREATE', 'Generate student fee invoices', 'FINANCE'),
    ('p_fin_pay', 'PAYMENT_RECORD', 'Record and reconcile fee payments', 'FINANCE'),
    ('p_aud_view', 'AUDIT_VIEW', 'Inspect immutable audit logs', 'COMPLIANCE'),
    ('p_set_mgt', 'SETTINGS_MANAGE', 'Configure institutional parameters', 'ADMIN')
ON CONFLICT DO NOTHING;

-- 3. Roles
INSERT INTO roles (id, institution_id, code, name, description, is_system_role)
VALUES
    ('role_admin', 'inst_apex_tvet', 'ADMIN', 'Institutional Administrator', 'Full campus administrative authority', TRUE),
    ('role_dean', 'inst_apex_tvet', 'DEAN', 'Dean of Academic Affairs', 'Academic oversight and results moderation', TRUE),
    ('role_lecturer', 'inst_apex_tvet', 'LECTURER', 'Faculty Instructor', 'Course delivery, continuous assessments and attendance', TRUE),
    ('role_finance', 'inst_apex_tvet', 'FINANCE', 'Finance & Bursary Officer', 'Fee billing, M-Pesa reconciliation and ledger oversight', TRUE),
    ('role_student', 'inst_apex_tvet', 'STUDENT', 'Enrolled Scholar', 'Course participation, assignment submission and fee review', TRUE)
ON CONFLICT DO NOTHING;

-- Map Role Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'role_admin', id FROM permissions ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('role_dean', 'p_stu_view'),
    ('role_dean', 'p_mark_mod'),
    ('role_dean', 'p_mark_appr'),
    ('role_dean', 'p_res_pub'),
    ('role_dean', 'p_aud_view'),
    ('role_lecturer', 'p_stu_view'),
    ('role_lecturer', 'p_mark_enter'),
    ('role_finance', 'p_stu_view'),
    ('role_finance', 'p_fin_inv'),
    ('role_finance', 'p_fin_pay'),
    ('role_student', 'p_stu_view')
ON CONFLICT DO NOTHING;

-- 4. Synthetic Users
-- Passwords hashed with BCrypt (Cost 10 for 'Password123!')
-- BCrypt string: $2a$10$wNqB3LpYFmX29.w03vE1Ueh.tXlFqV59tV7h6J3s9E5V7a1B.c4d.
INSERT INTO users (id, institution_id, identifier, email, password_hash, full_name, department_id, campus_id, status)
VALUES
    ('usr_admin', 'inst_apex_tvet', 'ADM-001', 'admin@apex.edu', '$2a$10$wNqB3LpYFmX29.w03vE1Ueh.tXlFqV59tV7h6J3s9E5V7a1B.c4d.', 'Dr. Elizabeth Mutua', 'dept_comp', 'cmp_main', 'ACTIVE'),
    ('usr_dean', 'inst_apex_tvet', 'STAFF-DEAN-01', 'dean.academics@apex.edu', '$2a$10$wNqB3LpYFmX29.w03vE1Ueh.tXlFqV59tV7h6J3s9E5V7a1B.c4d.', 'Prof. Geoffrey Kamau', 'dept_eng', 'cmp_main', 'ACTIVE'),
    ('usr_lecturer', 'inst_apex_tvet', 'LEC-CS-104', 'p.mwangi@apex.edu', '$2a$10$wNqB3LpYFmX29.w03vE1Ueh.tXlFqV59tV7h6J3s9E5V7a1B.c4d.', 'Eng. Patrick Mwangi', 'dept_comp', 'cmp_main', 'ACTIVE'),
    ('usr_finance', 'inst_apex_tvet', 'BURSAR-02', 'finance@apex.edu', '$2a$10$wNqB3LpYFmX29.w03vE1Ueh.tXlFqV59tV7h6J3s9E5V7a1B.c4d.', 'CPA Moses Cheruiyot', 'dept_biz', 'cmp_main', 'ACTIVE'),
    ('usr_student', 'inst_apex_tvet', 'CIT/0042/2024', 'john.kariuki@students.apex.edu', '$2a$10$wNqB3LpYFmX29.w03vE1Ueh.tXlFqV59tV7h6J3s9E5V7a1B.c4d.', 'John Kariuki', 'dept_comp', 'cmp_main', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
    ('usr_admin', 'role_admin'),
    ('usr_dean', 'role_dean'),
    ('usr_lecturer', 'role_lecturer'),
    ('usr_finance', 'role_finance'),
    ('usr_student', 'role_student')
ON CONFLICT DO NOTHING;

-- 5. Programs & Courses
INSERT INTO programs (id, institution_id, department_id, code, title, level, duration_semesters)
VALUES
    ('prog_dit', 'inst_apex_tvet', 'dept_comp', 'DIT', 'Diploma in Information Technology', 'DIPLOMA', 6),
    ('prog_deee', 'inst_apex_tvet', 'dept_eng', 'DEEE', 'Diploma in Electrical & Electronic Engineering', 'DIPLOMA', 6)
ON CONFLICT DO NOTHING;

INSERT INTO courses (id, program_id, code, name, credit_hours, semester, lecturer_user_id)
VALUES
    ('crs_cs201', 'prog_dit', 'CIT2101', 'Enterprise Database Management Systems', 4, 2, 'usr_lecturer'),
    ('crs_cs202', 'prog_dit', 'CIT2102', 'Network Engineering & Routing Protocols', 3, 2, 'usr_lecturer')
ON CONFLICT DO NOTHING;

-- 6. Students
INSERT INTO students (id, user_id, institution_id, campus_id, program_id, admission_number, full_name, gender, national_id, current_term_id, status, fee_balance)
VALUES
    ('stu_john', 'usr_student', 'inst_apex_tvet', 'cmp_main', 'prog_dit', 'CIT/0042/2024', 'John Kariuki', 'MALE', '39102948', 'term_2026_2', 'ACTIVE', 12500.00)
ON CONFLICT DO NOTHING;

-- 7. Fee Invoices & Seed Payments
INSERT INTO invoices (id, institution_id, invoice_number, student_id, academic_term_id, title, amount, paid_amount, balance, status, due_date)
VALUES
    ('inv_2026_01', 'inst_apex_tvet', 'INV-2026-0042', 'stu_john', 'term_2026_2', 'Term 2 Tuition and Lab Levy', 28500.00, 16000.00, 12500.00, 'PARTIAL', '2026-03-31')
ON CONFLICT DO NOTHING;

INSERT INTO payments (id, institution_id, student_id, invoice_id, receipt_number, amount, payment_method, transaction_reference, payer_phone, payer_name, status)
VALUES
    ('pay_001', 'inst_apex_tvet', 'stu_john', 'inv_2026_01', 'RCP-2026-0812', 16000.00, 'MPESA', 'SJA781LK92', '254712000111', 'John Kariuki', 'SUCCESS')
ON CONFLICT DO NOTHING;
