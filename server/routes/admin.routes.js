import express from 'express';
import { 
  authAdmin, 
  getDashboardStats, 
  getParticipants, 
  deleteParticipant, 
  updatePaymentStatus,
  updateParticipant,
  updateBookletStatus 
} from '../controllers/admin.controller.js';
import { 
  getCompetitions, 
  createCompetition, 
  updateCompetition, 
  deleteCompetition 
} from '../controllers/competition.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', authAdmin);
router.get('/dashboard', protect, getDashboardStats);
router.get('/participants', protect, getParticipants);
router.put('/participants/:id', protect, updateParticipant);
router.delete('/participants/:id', protect, deleteParticipant);
router.put('/participants/:id/payment', protect, updatePaymentStatus);
router.put('/participants/:id/booklet', protect, updateBookletStatus);

// Competitions management routes
router.get('/competitions', protect, getCompetitions);
router.post('/competitions', protect, createCompetition);
router.put('/competitions/:id', protect, updateCompetition);
router.delete('/competitions/:id', protect, deleteCompetition);

export default router;
