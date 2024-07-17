import express from 'express';
import { deleteUser } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.get('/', authMiddleware, deleteUser);
router.post('/', authMiddleware, deleteUser);
router.delete('/:reviewId', authMiddleware, deleteUser);

export default router;
