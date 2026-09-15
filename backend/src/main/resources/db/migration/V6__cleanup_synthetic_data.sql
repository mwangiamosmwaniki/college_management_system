-- ====================================================================
-- V6__cleanup_synthetic_data.sql
-- Corrective migration: Purge synthetic development/demo seed records
-- from production database tables. Production environments must only
-- contain authoritative tenant data.
-- ====================================================================

-- 1. Remove synthetic enrollments
DELETE FROM course_enrollments
WHERE id IN ('enr_john_cs201', 'enr_john_cs202')
   OR student_id = 'stu_john';

-- 2. Remove synthetic payments and allocations
DELETE FROM payment_allocations
WHERE student_id = 'stu_john'
   OR payment_id IN ('pay_001');

DELETE FROM receipts
WHERE student_id = 'stu_john'
   OR receipt_number = 'RCP-2026-0812';

DELETE FROM financial_ledgers
WHERE student_id = 'stu_john';

DELETE FROM payments
WHERE id = 'pay_001'
   OR student_id = 'stu_john'
   OR transaction_reference = 'SJA781LK92';

-- 3. Remove synthetic invoices
DELETE FROM invoices
WHERE id = 'inv_2026_01'
   OR student_id = 'stu_john'
   OR invoice_number = 'INV-2026-0042';

-- 4. Remove synthetic student marks and records
DELETE FROM student_marks
WHERE student_id = 'stu_john';

DELETE FROM students
WHERE id = 'stu_john'
   OR admission_number = 'CIT/0042/2024';

-- 5. Disassociate lecturer from courses
UPDATE courses
SET lecturer_user_id = NULL
WHERE lecturer_user_id = 'usr_lecturer';

-- 6. Remove synthetic user roles and users
DELETE FROM user_roles
WHERE user_id IN ('usr_admin', 'usr_dean', 'usr_lecturer', 'usr_finance', 'usr_student');

DELETE FROM users
WHERE id IN ('usr_admin', 'usr_dean', 'usr_lecturer', 'usr_finance', 'usr_student')
   OR identifier IN ('ADM-001', 'STAFF-DEAN-01', 'LEC-CS-104', 'BURSAR-02', 'CIT/0042/2024');
