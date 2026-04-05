import { Router } from 'express';
import { 
  loginUser, 
  registerStudent, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword 
} from '../../controllers/auth.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', loginUser);
router.post('/register/student', registerStudent);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', requireAuth, getCurrentUser);

export default router;
