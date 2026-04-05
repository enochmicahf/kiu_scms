import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'API V1 operates normally' });
});

router.use('/auth', authRoutes);

export default router;
