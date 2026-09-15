-- ====================================================================
-- test-data.sql
-- Test-Only Fixtures for automated tests and development environments.
-- NEVER executed as a production migration.
-- ====================================================================

-- 1. Test Institution
INSERT INTO institutions (id, name, short_name, motto, registration_number, accreditation_body, primary_color, currency)
VALUES (
    'inst_apex_tvet',
    'Apex National Polytechnic (Test Environment)',
    'Apex Test',
    'Skill, Innovation and Technical Excellence',
    'TVETA/TEST/2026/001',
    'TVETA',
    '#0284c7',
    'KES'
) ON CONFLICT (id) DO NOTHING;

-- Campuses
INSERT INTO campuses (id, institution_id, code, name, location, director_name)
VALUES
    ('cmp_main', 'inst_apex_tvet', 'MAIN', 'Main Campus (Nairobi)', 'Upper Hill Tech Corridor', 'Test Director'),
    ('cmp_western', 'inst_apex_tvet', 'WEST', 'Western Campus (Kisumu)', 'Lake Basin Innovation Hub', 'Test Western Director')
ON CONFLICT (id) DO NOTHING;

-- Departments
INSERT INTO departments (id, institution_id, code, name, hod_name)
VALUES
    ('dept_comp', 'inst_apex_tvet', 'CS_IT', 'Computing & Informatics', 'Test HOD CS'),
    ('dept_eng', 'inst_apex_tvet', 'ENG', 'Electrical & Electronic Engineering', 'Test HOD ENG'),
    ('dept_biz', 'inst_apex_tvet', 'BIZ', 'Business Studies', 'Test HOD BIZ')
ON CONFLICT (id) DO NOTHING;

-- Academic Years & Terms
INSERT INTO academic_years (id, institution_id, code, start_date, end_date, is_current)
VALUES
    ('ay_2025_2026', 'inst_apex_tvet', '2025/2026', '2025-09-01', '2026-08-31', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO academic_terms (id, academic_year_id, institution_id, term_name, start_date, end_date, status, is_active)
VALUES
    ('term_2026_1', 'ay_2025_2026', 'inst_apex_tvet', 'Term 1 (Sep - Dec 2025)', '2025-09-01', '2025-12-15', 'COMPLETED', FALSE),
    ('term_2026_2', 'ay_2025_2026', 'inst_apex_tvet', 'Term 2 (Jan - Apr 2026)', '2026-01-05', '2026-04-10', 'ACTIVE', TRUE),
    ('term_2026_3', 'ay_2025_2026', 'inst_apex_tvet', 'Term 3 (May - Aug 2026)', '2026-05-04', '2026-08-14', 'UPCOMING', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Programs & Courses
INSERT INTO programs (id, institution_id, department_id, code, title, level, duration_semesters)
VALUES
    ('prog_dit', 'inst_apex_tvet', 'dept_comp', 'DIT', 'Diploma in Information Technology', 'DIPLOMA', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (id, program_id, code, name, credit_hours, semester)
VALUES
    ('crs_cs201', 'prog_dit', 'CIT2101', 'Enterprise Database Management Systems', 4, 2),
    ('crs_cs202', 'prog_dit', 'CIT2102', 'Network Engineering & Routing Protocols', 3, 2)
ON CONFLICT (id) DO NOTHING;
