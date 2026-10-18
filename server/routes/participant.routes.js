import express from 'express';
import { registerParticipant, getParticipantById } from '../controllers/participant.controller.js';

const router = express.Router();

router.post('/register', registerParticipant);
router.get('/:id', getParticipantById);

export default router;
