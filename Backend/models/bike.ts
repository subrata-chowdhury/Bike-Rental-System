import { Schema, model, Document } from 'mongoose';

export interface IBike extends Document {
    // Bike (uniqeness)
    bikeModel: string;

    // Rental details
    pricePerHour: number;
    isAvailable: boolean;

    // Bike details
    brand: string;
    cc: number;
    horsePower: number;
    type: string;
    weight?: number;

    images: string[];
}

const bikeSchema = new Schema<IBike>({
    bikeModel: { type: String, required: true },

    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },

    brand: { type: String, required: true },
    cc: { type: Number, required: true },
    horsePower: { type: Number, required: true },
    type: { type: String, required: true },
    weight: { type: Number, required: false },

    images: { type: [String], required: true }
}, { timestamps: true });

export { bikeSchema as BikeSchema }

const Bike = model<IBike>('Bike', bikeSchema);
export default Bike;
