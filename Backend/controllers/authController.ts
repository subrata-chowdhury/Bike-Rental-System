import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import envVars from '../config/config';
import { Types } from 'mongoose';

// Handle user registration
export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (email.trim() === '' || password === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }
    if (!nameRegex.test(username.trim())) {
        return res.status(400).json({ message: 'Invalid username format' });
    }


    try {
        const user: IUser | null = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email: email, password: hashedPassword, username: username });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send token
        const token = jwt.sign({ id: user._id }, envVars.jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Handle user logout
export const logoutUser = async (req: Request, res: Response) => {
    // TODO: Implement user logout logic
};

// Handle password reset
export const resetPassword = async (req: Request, res: Response) => {
    // TODO: Implement password reset logic
};

// Handle email verification
export const verifyEmail = async (req: Request, res: Response) => {
    // TODO: Implement email verification logic
};

export const deleteUser = async (id: Types.ObjectId, req: Request, res: Response) => {
    try {
        const user: IUser | null = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}