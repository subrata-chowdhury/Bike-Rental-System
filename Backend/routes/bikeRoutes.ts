import express from 'express';
import { getBikesByIndexAndLimit, getBikeCount, createBike, deleteBike, getTypes } from '../controllers/bikeController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post('/', authMiddleware, getBikeCount);
router.get('/', getTypes);
router.post('/:index', authMiddleware, getBikesByIndexAndLimit);
router.post('/new', authMiddleware, createBike);
router.delete('/delete/:bikeId', authMiddleware, deleteBike);

export default router;
