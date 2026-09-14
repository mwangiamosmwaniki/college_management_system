-- V5: Seed authoritative course enrollments for existing seed students and add performance indexes
INSERT INTO course_enrollments (id, student_id, course_id, academic_term_id, enrollment_date, status)
VALUES
    ('enr_john_cs201', 'stu_john', 'crs_cs201', 'term_2026_2', CURRENT_DATE, 'ENROLLED'),
    ('enr_john_cs202', 'stu_john', 'crs_cs202', 'term_2026_2', CURRENT_DATE, 'ENROLLED')
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_term ON course_enrollments(academic_term_id);
