import express from 'express';
import { deleteUser } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';
import { getUser, updateUser } from '../controllers/userController';

const router = express.Router();

router.delete('/delete', authMiddleware, deleteUser);
router.get('/', authMiddleware, getUser);
router.put('/', authMiddleware, updateUser);

export default router;
