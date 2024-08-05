import express from 'express';
import { register, login, adminLogin, adminRegister } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


// ADMIN ROUTES

router.post('/admin/login', adminLogin)
router.post('/admin/register', authMiddleware, adminRegister)

export default router;
