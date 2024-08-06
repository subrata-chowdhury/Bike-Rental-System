import express from 'express';
import authMiddleware from '../middlewares/auth';
import { createBooking, getBookingThatHasToReturnToday, getBookingHistoryByUserId, updateBookingById, returnBikeByBikeId, getBookingThatHasToReturnByUserId, getBookingByIndex, getAllBookingCount } from '../controllers/bookingController';

const router = express.Router();

// router.delete('/:bookId', authMiddleware, );
router.get('/', authMiddleware, getBookingHistoryByUserId);
router.get('/returnBikes', authMiddleware, getBookingThatHasToReturnByUserId);
router.get('/bookingDetailsOfToday', authMiddleware, getBookingThatHasToReturnToday);
router.post('/bike/:bikeId', authMiddleware, returnBikeByBikeId);
router.post('/', authMiddleware, createBooking);


// ADMIN ROUTES

router.post('/page/:pageNo', authMiddleware, getBookingByIndex);
router.post('/pages/count', authMiddleware, getAllBookingCount);

export default router;
