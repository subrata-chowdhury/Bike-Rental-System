import { Request, Response } from 'express';
import { IBooking } from '../models/booking';
import Booking from '../models/booking';
import Bike, { IBike } from '../models/bike';
import { isValidObjectId } from 'mongoose';
import User from '../models/user';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
    try {
        const { bikeId, startTime, endTime } = req.body;
        const userId = req.body.user.id;

        const bike = await Bike.findById(bikeId);
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
            bikeId: bikeId,
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

// Get bookings by user ID
export const getBookingHistoryByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user.id;

        const bookings = await Booking.find({ userId, status: { $ne: 'booked' } }).sort({ endTime: -1 });
        const bikeList: any = [];
        for (let i = 0; i < bookings.length; i++) {
            const bike = await Bike.findById(bookings[i].bikeId);
            if (bike) {
                bikeList[i] = {
                    _id: bike._id,
                    bikeModel: bike.bikeModel,
                    pricePerHour: bike.pricePerHour,
                    isAvailable: bike.isAvailable,
                    brand: bike.brand,
                    cc: bike.cc,
                    horsePower: bike.horsePower,
                    type: bike.type,
                    imageURL: bike.imageURL,

                    startTime: bookings[i].startTime,
                    endTime: bookings[i].endTime,
                };
            } else {
                bikeList[i] = {
                    _id: bookings[i].bike._id,
                    bikeModel: bookings[i].bike.bikeModel,
                    pricePerHour: bookings[i].bike.pricePerHour,
                    isAvailable: bookings[i].bike.isAvailable,
                    brand: bookings[i].bike.brand,
                    cc: bookings[i].bike.cc,
                    horsePower: bookings[i].bike.horsePower,
                    type: bookings[i].bike.type,
                    imageURL: bookings[i].bike.imageURL,

                    startTime: bookings[i].startTime,
                    endTime: bookings[i].endTime,
                };
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

// Return a bike by bike ID
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
    const userId = req.body.user.id;
    try {
        const bookings = await Booking.find({ endTime: { $lt: new Date() }, status: 'booked', userId });
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
export const getBookingByIndex = async (req: Request, res: Response) => {
    const limit = 7
    const { pageNo } = req.params
    let { bookingId, userId } = req.body
    // if(!isValidObjectId(bookingId)) return res.status(400).json({ error: 'Invalid booking ID' });
    if (userId)
        if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    const index = (parseInt(pageNo) - 1) * limit
    try {
        const bookings = await Booking.find(userId ? { userId } : {}).skip(index).limit(limit).sort({ endTime: -1 }).populate('bike');
        let usersData = []
        for (let i = 0; i < bookings.length; i++) {
            const userData = await User.findById(bookings[i].userId)
            usersData.push(userData)
        }
        res.status(200).json({ bookingData: bookings, usersData: usersData });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get bookings' });
    }
};

export const getAllBookingCount = async (req: Request, res: Response) => {
    let { bookingId, userId } = req.body
    if (userId)
        if (!isValidObjectId(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    try {
        const total: number = await Booking.countDocuments(userId ? { userId } : {});
        res.status(200).json({ total: total });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bookings count' });
    }
}