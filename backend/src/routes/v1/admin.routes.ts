import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware';
import { 
  getAllComplaints, 
  getAdminStats, 
  getStaffMembers, 
  assignStaff, 
  updateStatus,
  addInternalNote,
  getInternalNotes
} from '../../controllers/admin.controller';

const router = Router();

// @route   GET /api/v1/admin/dashboard
// @desc    Get dashboard metrics for administrative overview
router.get('/dashboard', requireAuth, requireRole(['Admin', 'Staff']), getAdminStats);

// @route   GET /api/v1/admin/complaints
// @desc    Get all complaints with pagination/filters (Admin/Staff only)
router.get('/complaints', requireAuth, requireRole(['Admin', 'Staff']), getAllComplaints);

// @route   GET /api/v1/admin/staff
// @desc    Get all active staff members for assignment
router.get('/staff', requireAuth, requireRole(['Admin', 'Staff']), getStaffMembers);

// @route   PATCH /api/v1/admin/complaints/:id/assign
// @desc    Assign a complaint to a specific staff member
router.patch('/complaints/:id/assign', requireAuth, requireRole(['Admin', 'Staff']), assignStaff);

// @route   PATCH /api/v1/admin/complaints/:id/status
// @desc    Update complaint status with remarks (Timeline)
router.patch('/complaints/:id/status', requireAuth, requireRole(['Admin', 'Staff']), updateStatus);

// @route   POST /api/v1/admin/complaints/:id/notes
// @desc    Add internal note to a complaint
router.post('/complaints/:id/notes', requireAuth, requireRole(['Admin', 'Staff']), addInternalNote);

// @route   GET /api/v1/admin/complaints/:id/notes
// @desc    Get internal notes for a complaint
router.get('/complaints/:id/notes', requireAuth, requireRole(['Admin', 'Staff']), getInternalNotes);

export default router;
