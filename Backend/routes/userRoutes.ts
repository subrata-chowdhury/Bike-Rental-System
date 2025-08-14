import express from 'express';
import authMiddleware from '../middlewares/auth';
import { deleteUser, deleteUserByAdmin, getUsersByIndex, getUser, updateUser, updateUserByAdmin } from '../controllers/userController';
import { isAdmin } from '../controllers/roleChecker';

const router = express.Router();

router.delete('/delete', authMiddleware, deleteUser);
router.get('/', authMiddleware, getUser);
router.put('/', authMiddleware, updateUser);


// ADMIN ROUTES

router.get('/page/:pageNo', authMiddleware, isAdmin, getUsersByIndex);
router.put('/update', authMiddleware, isAdmin, updateUserByAdmin);
router.delete('/admin/deleteUser', authMiddleware, isAdmin, deleteUserByAdmin);

export default router;
