import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from "../models/user";
import Booking from '../models/booking';
import { isAdmin } from './roleChecker';
import { isValidObjectId } from 'mongoose';

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.headers.user;
        const user: IUser | null = await User.findById(id);
        if (user)
            user.password = "";
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.headers.user;
        const { username, email, password } = req.body;
        const user: IUser | null = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        user.username = username;
        user.email = email;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.headers.user;
        const { password } = req.body;

        const user: IUser | null = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // chcek if user has bikes to return
        const bookings = await Booking.find({ userId: id, status: 'booked' });
        if (bookings.length > 0) {
            res.status(400).json({ message: 'User has bikes to return' });
            return;
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Delete user's bookings
        await Booking.deleteMany({ userId: id });

        // Delete the user
        await User.findByIdAndDelete(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}




// ADMIN CONTROLS




export const getUsersByIndex = async (req: Request, res: Response) => {
    const limit = 7
    const { pageNo } = req.params
    const searchData = req.url.split('?')[1] ? new URLSearchParams(req.url.split('?')[1]) : new URLSearchParams();
    const filterData = JSON.parse(searchData.get('filter') || '{}');
    const email = filterData.email || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
    }

    const index = (parseInt(pageNo) - 1) * limit
    try {
        const bookings = await User.find(email ? { email } : {}).skip(index).limit(limit);
        const total: number = await User.countDocuments(email ? { email } : {});
        res.status(200).json({ users: bookings, totalUsers: total });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get users' });
    }
}

export const updateUserByAdmin = async (req: Request, res: Response) => {
    try {
        const { id, username, email, password, role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!emailRegex.test(email.trim())) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }
        if (password && password.length < 8) {
            res.status(400).json({ message: 'Password must be at least 8 characters long' });
            return;
        }
        if (email.trim() === '') {
            res.status(400).json({ message: 'Fields cannot be empty' });
            return;
        }
        if (!nameRegex.test(username.trim())) {
            res.status(400).json({ message: 'Invalid username format' });
            return;
        }

        const user: IUser | null = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (password != "") {
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword;
        }

        user.username = username;
        user.email = email;
        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const deleteUserByAdmin = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body

        const user: IUser | null = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // chcek if user has bikes to return
        const bookings = await Booking.find({ userId: userId, status: 'booked' });
        if (bookings.length > 0) {
            res.status(400).json({ message: 'User has bikes to return' });
            return;
        }

        // Delete user's bookings
        await Booking.deleteMany({ userId: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}