import express from 'express';
import authMiddleware from '../middlewares/auth';
import { deleteUser, getAllUsers, getUser, updateUser, updateUserByAdmin } from '../controllers/userController';

const router = express.Router();

router.delete('/delete', authMiddleware, deleteUser);
router.get('/', authMiddleware, getUser);
router.put('/', authMiddleware, updateUser);


// ADMIN ROUTES

router.get('/all', authMiddleware, getAllUsers);
router.put('/update', authMiddleware, updateUserByAdmin);

export default router;
