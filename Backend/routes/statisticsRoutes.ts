import express from 'express';
import authMiddleware from '../middlewares/auth';
import { getStatistics } from '../controllers/statisticsController';
import { isAdmin } from '../controllers/roleChecker';

const router = express.Router();

// router.delete('/:bookId', authMiddleware, );
router.get('/', authMiddleware, isAdmin, getStatistics);

export default router;