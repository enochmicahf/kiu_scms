-- Migration: Add Department Officer Role & Schema Extensibility

-- 1. Insert Role (Ignore if it exists to make it safe)
INSERT IGNORE INTO roles (name) VALUES ('Department Officer');

-- 2. Add role_id to staff (strict compliance)
ALTER TABLE staff ADD COLUMN role_id INT NULL;

-- 3. Add department_id to complaints for supervisor routing
ALTER TABLE complaints ADD COLUMN department_id INT NULL;
ALTER TABLE complaints ADD CONSTRAINT fk_comp_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- 4. Backfill existing complaints with their origin student's department
UPDATE complaints c
JOIN students s ON c.student_id = s.id
SET c.department_id = s.department_id
WHERE c.department_id IS NULL;
