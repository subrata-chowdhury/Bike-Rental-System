import express from 'express';
import authMiddleware from '../middlewares/auth';
import { deleteUser, getUser, updateUser } from '../controllers/userController';

const router = express.Router();

router.delete('/delete', authMiddleware, deleteUser);
router.get('/', authMiddleware, getUser);
router.put('/', authMiddleware, updateUser);

export default router;
