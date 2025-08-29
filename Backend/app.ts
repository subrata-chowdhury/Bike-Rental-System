import express from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import bikeRoutes from './routes/bikeRoutes';
import bookingRoutes from './routes/bookingRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

import cors from 'cors';
import connectDB from './config/db';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

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
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'bikeImages')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/statistics', statisticsRoutes);

const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
