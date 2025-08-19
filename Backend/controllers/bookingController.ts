import { Request, Response } from 'express';
import { IBooking } from '../models/booking';
import Booking from '../models/booking';
import Bike, { IBike } from '../models/bike';
import { isValidObjectId } from 'mongoose';
import { io } from '../app';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { bikeId, startTime, endTime } = req.body;
        const userId = req.headers.user;

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);


        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            res.status(400).json({ error: 'Invalid date format' });
            return;
        }
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (startDate < currentDate || endDate < currentDate) {
            res.status(400).json({ error: 'Dates cannot be in the past' });
            return;
        }
        if (startDate > endDate) {
            res.status(400).json({ error: 'End time must be after start time' });
            return;
        }
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            res.status(404).json({ error: 'Bike not found' });
            return;
        }
        if (!bike.isAvailable) {
            res.status(400).json({ error: 'Bike is not available' });
            return;
        }

        bike.isAvailable = false;
        await bike.save();

        const newBooking: IBooking = new Booking({
            userId: userId,
            bikeId: bikeId,
            bike: bike,
            startTime,
            endTime,
            status: 'booked'
        });
        const savedBooking = await newBooking.save();

        bike.isAvailable = false;
        await bike.save();

        io.emit('bike_details_changed', { bike });
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// Get bookings by user ID
export const getBookingHistoryByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.user;

        const bookings = await Booking.find({ userId, status: { $ne: 'booked' } })
            .sort({ endTime: -1 })
            .populate('bikeId', null, Bike);
        const bikeList: any = [];
        for (let i = 0; i < bookings.length; i++) {
            bikeList.push(bookings[i].bikeId);
        }

        res.status(200).json(bikeList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings by user ID' });
    }
};

export const getBookingThatHasToReturnByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.user;
        const bookings = await Booking.find({ userId, status: 'booked' }).populate('bikeId', null, Bike);
        if (!bookings) {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        const bikeList: any[] = [];
        for (let i = 0; i < bookings.length; i++) {
            bikeList.push(bookings[i].bikeId);
        }
        res.status(200).json(bikeList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings by user ID' });
    }
}

// Return a bike by bike ID
export const returnBikeByBikeId = async (req: Request, res: Response) => {
    try {
        const { bikeId } = req.params;
        const bike = await Bike.findById(bikeId);
        if (!bike) {
            res.status(404).json({ error: 'Bike not found' });
            return;
        }
        bike.isAvailable = true;
        await bike.save();

        const booking = await Booking.findOne({ bikeId: bikeId, status: 'booked' });
        if (booking) {
            booking.status = 'returned';
            await booking.save();
        } else {
            res.status(404).json({ error: 'Booking not found' });
            return;
        }
        io.emit('bike_details_changed', { bike });
        res.status(200).json({ message: 'Bike returned successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to return bike' });
    }
}

export const getBookingThatHasToReturnToday = async (req: Request, res: Response) => {
    const userId = req.headers.user;
    try {
        const bookings = await Booking.find({ endTime: { $lt: new Date() }, status: 'booked', userId });
        if (!bookings) {
            res.status(404).json({ error: 'Booking not found' });
            return;
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
export const getBookingByIndex = async (req: Request, res: Response) => {
    const limit = 7
    const { pageNo } = req.params
    const searchData = req.url.split('?')[1] ? new URLSearchParams(req.url.split('?')[1]) : new URLSearchParams();
    const filterData = JSON.parse(searchData.get('filter') || '{}');
    const userId = filterData.userId || null;
    if (userId)
        if (!isValidObjectId(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

    const index = (parseInt(pageNo) - 1) * limit
    try {
        const bookings = await Booking.find(userId ? { userId } : {}).skip(index).limit(limit).sort({ endTime: -1 }).populate('bike').populate('userId');
        const total: number = await Booking.countDocuments(userId ? { userId } : {});
        res.status(200).json({ bookingData: bookings, totalBookings: total });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get bookings' });
    }
};