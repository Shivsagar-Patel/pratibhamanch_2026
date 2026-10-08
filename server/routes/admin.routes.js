import express from 'express';
import { authAdmin, getDashboardStats, getParticipants } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', authAdmin);
router.get('/dashboard', protect, getDashboardStats);
router.get('/participants', protect, getParticipants);

export default router;
