import { Router } from 'express';

const router = Router();

// @route   POST /api/v1/complaints
// @desc    Submit a new complaint
// @access  Private (Student)
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not Implemented: Submit Complaint' });
});

// @route   GET /api/v1/complaints
// @desc    Get complaints for current user
// @access  Private
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not Implemented: Get Complaints' });
});

// @route   GET /api/v1/complaints/:id
// @desc    Get single complaint details
// @access  Private
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not Implemented: Get Complaint Details' });
});

// @route   PATCH /api/v1/complaints/:id/status
// @desc    Update complaint status
// @access  Private (Staff/Admin)
router.patch('/:id/status', (req, res) => {
  res.status(501).json({ message: 'Not Implemented: Update Status' });
});

export default router;
