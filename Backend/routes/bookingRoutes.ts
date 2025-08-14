import express from 'express';
import authMiddleware from '../middlewares/auth';
import { createBooking, getBookingThatHasToReturnToday, getBookingHistoryByUserId, returnBikeByBikeId, getBookingThatHasToReturnByUserId, getBookingByIndex } from '../controllers/bookingController';
import { isAdmin } from '../controllers/roleChecker';

const router = express.Router();

// router.delete('/:bookId', authMiddleware, );
router.get('/', authMiddleware, getBookingHistoryByUserId);
router.get('/returnBikes', authMiddleware, getBookingThatHasToReturnByUserId);
router.get('/bookingDetailsOfToday', authMiddleware, getBookingThatHasToReturnToday);
router.post('/bike/:bikeId', authMiddleware, returnBikeByBikeId);
router.post('/', authMiddleware, createBooking);


// ADMIN ROUTES

router.get('/page/:pageNo', authMiddleware, isAdmin, getBookingByIndex);

export default router;
