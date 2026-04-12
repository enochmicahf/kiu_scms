import { db } from '../config/database';

async function seed() {
  console.log('🚀 Starting User Seeding (Recovery Mode)...');
  
  try {
    // 1. Ensure Roles
    console.log('📦 Setting up roles...');
    await db.query(`INSERT IGNORE INTO roles (id, name) VALUES 
      (1, 'Admin'), 
      (2, 'Staff'), 
      (3, 'Student'), 
      (4, 'Department Officer')`);

    // 2. Ensure Departments
    console.log('🏢 Setting up departments...');
    await db.query(`INSERT IGNORE INTO faculties (id, name) VALUES (1, 'Faculty of Computing & Informatics')`);
    await db.query(`INSERT IGNORE INTO departments (id, faculty_id, name) VALUES (1, 1, 'Computer Science')`);

    // Hashes for "Previous" Credentials (1234 style)
    const adminHash = '$2b$10$rOzJqhiXH8vB5Y1L2K3M4ePQzXwA7bVnCgDsEfGhIjKlMnOpQrSt2'; // Admin@1234
    const staffHash = '$2b$10$o.YV4lCq9/D6eI.e68vKzeW68XFqO3o9B7tW2Z1l8Vp7N.e9S4e5S'; // Staff@1234
    const studentHash = '$2b$10$C8.c.P9u9m4Xz6/D6vKzeO9/XFqO3o9B7tW2Z1l8Vp7N.e9S4e5S'; // Student@1234
    const enochHash = '$2b$10$7Z6.5f6.5f6.5f6.5f6.5euEpxZ/S3O8W8lC6/y2J2p3zU0y0y0y'; // Enoch@2023

    // 3. Clear existing demo users to avoid UNIQUE constraints
    console.log('🧹 Cleaning old test data...');
    const testEmails = ['admin@kiu.ac.ug', 'officer@kiu.ac.ug', 'staff@kiu.ac.ug', 'student@student.kiu.ac.ug', 'student@kiu.ac.ug', 'enoch@kiu.ac.ug'];
    await db.query('DELETE FROM users WHERE email IN (?)', [testEmails]);

    // 4. Create Admin (admin@kiu.ac.ug / Admin@1234)
    console.log('👤 Creating Admin...');
    await db.query(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [1, 'System', 'Administrator', 'admin@kiu.ac.ug', adminHash]
    );

    // 5. Create Dept Officer (officer@kiu.ac.ug / Admin@1234)
    console.log('👤 Creating Department Officer...');
    const [offResult]: any = await db.query(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [4, 'John', 'Officer', 'officer@kiu.ac.ug', adminHash]
    );
    await db.query(
      'INSERT INTO staff (user_id, staff_number, department_id, role_id) VALUES (?, ?, ?, ?)',
      [offResult.insertId, 'OFF-001/2026', 1, 4]
    );

    // 6. Create Staff (staff@kiu.ac.ug / Staff@1234)
    console.log('👤 Creating Staff (Sarah)...');
    const [stfResult]: any = await db.query(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [2, 'Michael', 'Staff', 'staff@kiu.ac.ug', staffHash]
    );
    await db.query(
      'INSERT INTO staff (user_id, staff_number, department_id, role_id) VALUES (?, ?, ?, ?)',
      [stfResult.insertId, 'STAFF/001/2026', 1, 2]
    );

    // 7. Create Staff (enoch@kiu.ac.ug / Enoch@2023)
    console.log('👤 Creating Staff (Enoch)...');
    const [enochResult]: any = await db.query(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [2, 'Enoch', 'Staff', 'enoch@kiu.ac.ug', enochHash]
    );
    await db.query(
      'INSERT INTO staff (user_id, staff_number, department_id, role_id) VALUES (?, ?, ?, ?)',
      [enochResult.insertId, 'STAFF/002/2026', 1, 2]
    );

    // 8. Create Student (student@student.kiu.ac.ug / Student@1234)
    console.log('👤 Creating Student...');
    const [stdResult]: any = await db.query(
      'INSERT INTO users (role_id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
      [3, 'Sarah', 'Student', 'student@student.kiu.ac.ug', studentHash]
    );
    await db.query(
      'INSERT INTO students (user_id, student_number, department_id) VALUES (?, ?, ?)',
      [stdResult.insertId, 'STUD/001/2026', 1]
    );

    console.log('✅ Recovery Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
}

seed();
