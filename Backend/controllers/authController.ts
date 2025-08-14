import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import envVars from '../config/config';
import { isAdmin } from './roleChecker';
import { io } from '../app';

// Handle user registration
export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!emailRegex.test(email.trim())) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters long' });
        return;
    }
    if (email.trim() === '' || password === '') {
        res.status(400).json({ message: 'Fields cannot be empty' });
        return;
    }
    if (!nameRegex.test(username.trim())) {
        res.status(400).json({ message: 'Invalid username format' });
        return;
    }


    try {
        const user: IUser | null = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
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
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Create and send token
        const token = jwt.sign({ id: user._id, role: user.role }, envVars.jwtSecret, { expiresIn: '1d' });

        io.emit('user_logedin', user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};




// ADMIN CONTROLS




export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        if (!user.role || user.role !== 'admin') {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Create and send token
        const token = jwt.sign({ id: user._id, role: user.role }, envVars.jwtSecret, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const adminRegister = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!emailRegex.test(email.trim())) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 characters long' });
        return;
    }
    if (email.trim() === '' || password === '') {
        res.status(400).json({ message: 'Fields cannot be empty' });
        return;
    }
    if (!nameRegex.test(username.trim())) {
        res.status(400).json({ message: 'Invalid username format' });
        return;
    }

    try {
        const user: IUser | null = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'Admin already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email: email, password: hashedPassword, username: username, role: 'admin' });
        await newUser.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};