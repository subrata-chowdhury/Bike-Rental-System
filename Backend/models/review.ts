import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
    user: Types.ObjectId;
    bike: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bike: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Review = model<IReview>('Review', reviewSchema);
export default Review;
