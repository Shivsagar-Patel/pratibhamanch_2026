import express from 'express';
import { registerParticipant } from '../controllers/participant.controller.js';

const router = express.Router();

router.post('/register', registerParticipant);

export default router;
