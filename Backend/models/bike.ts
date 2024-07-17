import { Schema, model, Document } from 'mongoose';

export interface IBike extends Document {
    bikeModel: string;
    brand: string;
    pricePerHour: number;
    isAvailable: boolean;
}

const bikeSchema = new Schema<IBike>({
    bikeModel: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
});

const Bike = model<IBike>('Bike', bikeSchema);
export default Bike;
