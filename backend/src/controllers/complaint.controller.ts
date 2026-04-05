import { Request, Response } from 'express';
import { db } from '../config/database';
import path from 'path';

// Helper: Generate reference number like SCM-2025-000123
const generateReference = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const [rows]: any = await db.query(
    'SELECT COUNT(*) as total FROM complaints WHERE YEAR(created_at) = ?', [year]
  );
  const seq = (parseInt(rows[0].total) + 1).toString().padStart(6, '0');
  return `SCM-${year}-${seq}`;
};

// @desc    Submit a new complaint
export const submitComplaint = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { title, categoryId, description, priority } = req.body;

  try {
    // Get student record
    const [students]: any = await db.query(
      'SELECT id FROM students WHERE user_id = ?', [userId]
    );
    if (students.length === 0) {
      return res.status(403).json({ status: 'error', message: 'Only students can submit complaints' });
    }
    const studentId = students[0].id;

    const reference = await generateReference();

    // Insert complaint
    const [result]: any = await db.query(
      `INSERT INTO complaints (student_id, category_id, title, description, priority, status, reference_number)
       VALUES (?, ?, ?, ?, ?, 'Submitted', ?)`,
      [studentId, categoryId, title, description, priority || 'Medium', reference]
    );
    const complaintId = result.insertId;

    // Handle file attachments
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const relPath = `/uploads/${file.filename}`;
        await db.query(
          'INSERT INTO complaint_attachments (complaint_id, file_path, file_type) VALUES (?, ?, ?)',
          [complaintId, relPath, path.extname(file.originalname).toLowerCase()]
        );
      }
    }

    // Insert initial status history
    await db.query(
      `INSERT INTO complaint_status_history (complaint_id, status, changed_by_user_id, remarks)
       VALUES (?, 'Submitted', ?, 'Complaint submitted by student')`,
      [complaintId, userId]
    );

    res.status(201).json({
      status: 'success',
      message: 'Complaint submitted successfully',
      data: { id: complaintId, reference }
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get complaints for current student
export const getMyComplaints = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { status, category, search, page = '1', limit = '10' } = req.query as any;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [students]: any = await db.query('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) return res.json({ status: 'success', data: [], total: 0 });
    const studentId = students[0].id;

    let where = 'WHERE c.student_id = ?';
    const params: any[] = [studentId];

    if (status) { where += ' AND c.status = ?'; params.push(status); }
    if (category) { where += ' AND c.category_id = ?'; params.push(category); }
    if (search) { where += ' AND (c.title LIKE ? OR c.reference_number LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) as total FROM complaints c ${where}`, params
    );
    const total = countRows[0].total;

    const [rows]: any = await db.query(
      `SELECT c.id, c.reference_number, c.title, c.status, c.priority, c.created_at, c.updated_at,
              cc.name as category_name
       FROM complaints c
       JOIN complaint_categories cc ON c.category_id = cc.id
       ${where}
       ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({ status: 'success', data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get single complaint details with timeline
export const getComplaintById = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { id } = req.params;

  try {
    const [rows]: any = await db.query(
      `SELECT c.*, cc.name as category_name,
              u.first_name, u.last_name, u.email
       FROM complaints c
       JOIN complaint_categories cc ON c.category_id = cc.id
       JOIN students s ON c.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE c.id = ? AND s.user_id = ?`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Complaint not found' });
    }

    const [attachments]: any = await db.query(
      'SELECT * FROM complaint_attachments WHERE complaint_id = ?', [id]
    );

    const [timeline]: any = await db.query(
      `SELECT csh.*, u.first_name, u.last_name, r.name as role_name
       FROM complaint_status_history csh
       JOIN users u ON csh.changed_by_user_id = u.id
       JOIN roles r ON u.role_id = r.id
       WHERE csh.complaint_id = ?
       ORDER BY csh.changed_at ASC`,
      [id]
    );

    res.json({
      status: 'success',
      data: { ...rows[0], attachments, timeline }
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get student dashboard stats
export const getStudentStats = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;

  try {
    const [students]: any = await db.query('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) return res.json({ status: 'success', data: {} });
    const studentId = students[0].id;

    const [total]: any = await db.query('SELECT COUNT(*) as count FROM complaints WHERE student_id = ?', [studentId]);
    const [open]: any = await db.query(`SELECT COUNT(*) as count FROM complaints WHERE student_id = ? AND status NOT IN ('Resolved','Closed','Rejected')`, [studentId]);
    const [resolved]: any = await db.query(`SELECT COUNT(*) as count FROM complaints WHERE student_id = ? AND status = 'Resolved'`, [studentId]);
    const [recent]: any = await db.query(
      `SELECT c.id, c.reference_number, c.title, c.status, c.priority, c.created_at, cc.name as category_name
       FROM complaints c JOIN complaint_categories cc ON c.category_id = cc.id
       WHERE c.student_id = ? ORDER BY c.created_at DESC LIMIT 5`,
      [studentId]
    );

    res.json({
      status: 'success',
      data: {
        total: total[0].count,
        open: open[0].count,
        resolved: resolved[0].count,
        recent
      }
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Get complaint categories (public)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query('SELECT id, name, description FROM complaint_categories ORDER BY name');
    res.json({ status: 'success', data: rows });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
