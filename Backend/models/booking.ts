import { Schema, model, Document } from 'mongoose';
import { BikeSchema, IBike } from './bike';

export interface IBooking extends Document {
    userId: Schema.Types.ObjectId;
    bikeId: Schema.Types.ObjectId;
    bike: IBike;
    startTime: Date;
    endTime: Date;
    status: string;
}

const bookingSchema = new Schema<IBooking>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    bike: { type: BikeSchema, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'returned', 'canceled'], default: 'booked' },
}, { timestamps: true });

const Booking = model<IBooking>('Booking', bookingSchema);
export default Booking;
