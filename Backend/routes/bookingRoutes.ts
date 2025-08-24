import express from 'express';
import authMiddleware from '../middlewares/auth';
import { createBooking, getBookingThatHasToReturnToday, getBookingHistoryByUserId, returnBikeByBikeId, getBookingThatHasToReturnByUserId, getBookingByIndex, getBookingThatHasRequestedToReturn, pickBikeByBikeId, getBookingThatHasToPickedUpByUserId, getBookingsByUserId } from '../controllers/bookingController';
import { isAdmin } from '../controllers/roleChecker';

const router = express.Router();

// router.delete('/:bookId', authMiddleware, );
router.get('/:index', authMiddleware, getBookingsByUserId);
router.post('/', authMiddleware, createBooking);
router.post('/bike/:bikeId', authMiddleware, returnBikeByBikeId);
router.post('/bike/pick/:bikeId', authMiddleware, pickBikeByBikeId);


// ADMIN ROUTES

router.get('/page/:pageNo', authMiddleware, isAdmin, getBookingByIndex);

export default router;
