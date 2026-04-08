INSERT INTO complaint_categories (name, description) VALUES 
('Academic', 'Issues related to lectures, examinations, grading, and curriculum.'),
('Administrative', 'Issues related to university administration, registration, and student records.'),
('Facilities', 'Issues related to university infrastructure, hostels, and maintenance.'),
('Finance', 'Issues related to tuition fees, scholarships, and bursary payments.'),
('Welfare', 'Issues related to health, security, and general student wellbeing.'),
('Other', 'General complaints not fitting into specific categories.')
ON DUPLICATE KEY UPDATE description = VALUES(description);
