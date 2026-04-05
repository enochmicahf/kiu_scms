import { Router, Request, Response } from 'express';
import { db } from '../../config/database';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// @route   GET /api/v1/admin/departments (PUBLIC — used by registration form)
router.get('/departments', async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      `SELECT d.id, d.name, f.name as faculty_name 
       FROM departments d 
       JOIN faculties f ON d.faculty_id = f.id 
       ORDER BY f.name, d.name`
    );
    res.json({ status: 'success', data: rows });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/v1/admin/dashboard (Admin only)
router.get('/dashboard', requireAuth, requireRole(['Admin']), async (req: Request, res: Response) => {
  try {
    const [totalComplaints]: any = await db.query('SELECT COUNT(*) as count FROM complaints');
    const [openComplaints]: any = await db.query(`SELECT COUNT(*) as count FROM complaints WHERE status NOT IN ('Resolved','Closed','Rejected')`);
    const [totalUsers]: any = await db.query('SELECT COUNT(*) as count FROM users');
    const [totalStudents]: any = await db.query('SELECT COUNT(*) as count FROM students');

    res.json({
      status: 'success',
      data: {
        totalComplaints: totalComplaints[0].count,
        openComplaints: openComplaints[0].count,
        totalUsers: totalUsers[0].count,
        totalStudents: totalStudents[0].count,
      }
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/v1/admin/users (Admin only)
router.get('/users', requireAuth, requireRole(['Admin']), async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.is_active, u.created_at,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );
    res.json({ status: 'success', data: rows });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// @route   GET /api/v1/admin/reports (Admin only)
router.get('/reports', requireAuth, requireRole(['Admin']), async (req: Request, res: Response) => {
  try {
    const [byStatus]: any = await db.query(
      `SELECT status, COUNT(*) as count FROM complaints GROUP BY status ORDER BY count DESC`
    );
    const [byCategory]: any = await db.query(
      `SELECT cc.name as category, COUNT(c.id) as count 
       FROM complaints c 
       JOIN complaint_categories cc ON c.category_id = cc.id 
       GROUP BY cc.name ORDER BY count DESC`
    );
    res.json({ status: 'success', data: { byStatus, byCategory } });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;

