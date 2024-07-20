import express from 'express';
import authMiddleware from '../middlewares/auth';
import { createBooking, getBookingById, getBookingHistoryByUserId, updateBookingById, returnBikeByBikeId, getBookingThatHasToReturnByUserId } from '../controllers/bookingController';

const router = express.Router();

// router.delete('/:bookId', authMiddleware, );
router.get('/', authMiddleware, getBookingHistoryByUserId);
router.get('/returnBikes', authMiddleware, getBookingThatHasToReturnByUserId);
router.post('/bike/:bikeId', authMiddleware, returnBikeByBikeId);
router.post('/', authMiddleware, createBooking);

export default router;
