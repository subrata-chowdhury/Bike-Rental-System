import express from 'express';
import { deleteUser } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.delete('/delete', authMiddleware, deleteUser);

export default router;
