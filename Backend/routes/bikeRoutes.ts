import express from 'express';
import { getAllBikes, getBikesByIndexAndLimit, getBikeCount, createBike, deleteBike } from '../controllers/bikeController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.get('/', authMiddleware, getBikeCount);
router.get('/:index', authMiddleware, getBikesByIndexAndLimit);
router.post('/', authMiddleware, createBike);
router.delete('/:bikeId', authMiddleware, deleteBike);

export default router;
