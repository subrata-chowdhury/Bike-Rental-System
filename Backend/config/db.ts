import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://subratachowdhury7000:96141075@cluster0.men5q.mongodb.net/bike-rental-system?retryWrites=true&w=majority');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default connectDB;
