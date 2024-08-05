import { Request, Response } from 'express';
import { IBooking } from '../models/booking';
import Booking from '../models/booking';
import Bike, { IBike } from '../models/bike';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { _id, startTime, endTime } = req.body;
        const userId = req.body.user.id;

        const bike = await Bike.findById(_id);
        if (!bike) {
            return res.status(404).json({ error: 'Bike not found' });
        }
        if (!bike.isAvailable) {
            return res.status(400).json({ error: 'Bike is not available' });
        }

        bike.isAvailable = false;
        await bike.save();

        const newBooking: IBooking = new Booking({
            userId: userId,
            bikeId: _id,
            bike: bike,
            startTime,
            endTime,
            status: 'booked'
        });
        const savedBooking = await newBooking.save();

        bike.isAvailable = false;
        await bike.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// Get a single booking by ID
export const getBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get booking' });
    }
};

// Get bookings by user ID
export const getBookingHistoryByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user.id;

        const bookings = await Booking.find({ userId, status: { $ne: 'booked' } }).sort({ endTime: -1 });
        const bikeList: IBike[] = [];
        for (let i = 0; i < bookings.length; i++) {
            const bike = await Bike.findById(bookings[i].bikeId);
            if (bike) {
                bikeList[i] = bike;
            } else {
                bikeList[i] = bookings[i].bike;
            }
        }

        res.status(200).json(bikeList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings by user ID' });
    }
};

export const getBookingThatHasToReturnByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user.id;
        const bookings = await Booking.find({ userId, status: 'booked' });
        if (!bookings) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const bikeList: IBike[] = [];
        for (let i = 0; i < bookings.length; i++) {
            const bike = await Bike.findById(bookings[i].bikeId);
            if (bike) {
                bikeList[i] = bike;
            } else {
                bikeList[i] = bookings[i].bike;
            }
        }
        res.status(200).json(bikeList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings by user ID' });
    }
}


// Update a booking by ID
export const updateBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = req.params.id;
        const userId = req.body.user.id;
        const { bikeId, startTime, endTime, status } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { userId, bikeId, startTime, endTime, status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

export const returnBikeByBikeId = async (req: Request, res: Response) => {
    try {
        const { bikeId } = req.params;
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).json({ error: 'Bike not found' });
        }
        bike.isAvailable = true;
        await bike.save();

        const booking = await Booking.findOne({ bikeId: bikeId, status: 'booked' });
        if (booking) {
            booking.status = 'returned';
            await booking.save();
        } else {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json({ message: 'Bike returned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to return bike' });
    }
}

export const getBookingThatHasToReturnToday = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({ endTime: { $lt: new Date() }, status: 'booked' });
        if (!bookings) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const bikeList: IBike[] = [];
        for (let i = 0; i < bookings.length; i++) {
            const bike = await Bike.findById(bookings[i].bikeId);
            if (bike) {
                bikeList[i] = bike;
            } else {
                bikeList[i] = bookings[i].bike;
            }
        }
        res.status(200).json(bikeList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings by user ID' });
    }
}



// ADMIN CONTROLS



// Get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings' });
    }
};