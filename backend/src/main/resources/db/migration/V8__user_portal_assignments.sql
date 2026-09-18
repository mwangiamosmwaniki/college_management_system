-- ====================================================================
-- V8__user_portal_assignments.sql
-- Domain relationship for UserPortalAssignment.
-- Makes portal access a genuinely persisted domain entity rather than
-- synthetically generated from roles.
-- ====================================================================

CREATE TABLE user_portal_assignments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portal_id VARCHAR(32) NOT NULL,
    role_id VARCHAR(64) REFERENCES roles(id) ON DELETE SET NULL,
    is_default BOOLEAN DEFAULT FALSE,
    institution_id VARCHAR(64) NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, portal_id)
);

CREATE INDEX idx_user_portal_assignments_user ON user_portal_assignments(user_id);
CREATE INDEX idx_user_portal_assignments_active ON user_portal_assignments(user_id, active);

-- Seed domain-level portal assignments for existing synthetic users
INSERT INTO user_portal_assignments (id, user_id, portal_id, role_id, is_default, institution_id, active, assigned_at)
VALUES
    ('upa_admin_admin', 'usr_admin', 'ADMIN', 'role_admin', TRUE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_dean_exam', 'usr_dean', 'EXAMINATIONS', 'role_dean', TRUE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_dean_lec', 'usr_dean', 'LECTURER', 'role_dean', FALSE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_dean_elearn', 'usr_dean', 'ELEARNING', 'role_dean', FALSE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_lec_lec', 'usr_lecturer', 'LECTURER', 'role_lecturer', TRUE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_lec_elearn', 'usr_lecturer', 'ELEARNING', 'role_lecturer', FALSE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_fin_fin', 'usr_finance', 'FINANCE', 'role_finance', TRUE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_stu_stu', 'usr_student', 'STUDENT', 'role_student', TRUE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_stu_elearn', 'usr_student', 'ELEARNING', 'role_student', FALSE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP),
    ('upa_stu_elib', 'usr_student', 'ELIBRARY', 'role_student', FALSE, 'inst_apex_tvet', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (user_id, portal_id) DO NOTHING;
