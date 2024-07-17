import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
    userId: Schema.Types.ObjectId;
    bikeId: Schema.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: string;
}

const bookingSchema = new Schema<IBooking>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['booked', 'completed', 'canceled'], default: 'booked' },
});

const Booking = model<IBooking>('Booking', bookingSchema);
export default Booking;
