import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import bikeRoutes from './routes/bikeRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';

import config from './config/config';
import cors from 'cors';
import connectDB from './config/db';

const app = express();

connectDB();

// const corsOptions = {
//     origin: 'http://localhost:5173', // Replace this with your frontend's origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// };

app.use(cors());
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bike', bikeRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);

const PORT = config.port || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
