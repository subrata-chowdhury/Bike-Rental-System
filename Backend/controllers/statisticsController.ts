import { Request, Response } from 'express';
import Bike, { IBike } from '../models/bike';
import Booking from '../models/booking';

export const getStatistics = async (req: Request, res: Response) => {
    const year = parseInt(req.query.year as string, 10);
    if (isNaN(year)) {
        return res.status(400).json({ error: 'Invalid year parameter' });
    }

    try {
        const result = await Bike.aggregate([
            {
                $group: {
                    _id: "$isAvailable",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format result into { available, notAvailable }
        const counts = {
            available: 0,
            notAvailable: 0
        };

        result.forEach(item => {
            if (item._id === true) {
                counts.available = item.count;
            } else {
                counts.notAvailable = item.count;
            }
        });

        const bookings = await Booking.find({
            status: 'returned',
            $expr: {
                $eq: [{ $year: "$startTime" }, year]
            }
        }).lean();
        const revenues: { month: number, revenue: number }[] = [];
        bookings.forEach(booking => {
            const month = new Date(booking.startTime).getMonth();
            const revenue = Math.floor(Math.abs(new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 1000 / 60) * (booking.bike.pricePerHour / 60);
            revenues[month] = {
                month: month,
                revenue: (revenues[month]?.revenue || 0) + revenue
            };
        });
        const statusCounts = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",          // group by status
                    count: { $sum: 1 }       // count documents
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",          // rename _id to name
                    count: 1
                }
            }
        ]);

        res.status(200).json({ counts, totalRevenue: revenues, statusCounts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bike availability counts' });
        throw error;
    }
}