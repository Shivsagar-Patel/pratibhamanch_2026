import express from 'express';
import { getCompetitions, getCompetitionBySlug } from '../controllers/competition.controller.js';

const router = express.Router();

router.get('/', getCompetitions);
router.get('/:slug', getCompetitionBySlug);

export default router;
