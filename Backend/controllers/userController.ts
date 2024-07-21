import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from "../models/user";

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.body.user.id;
        const user: IUser | null = await User.findById(id);
        const customUser = {
            firstName: user?.username.split(' ')[0],
            lastName: user?.username.split(' ')[1],
            email: user?.email,
            role: user?.role
        };
        res.status(200).json(customUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.body.user.id;
        const { username, email, password } = req.body;
        const user: IUser | null = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        user.username = username;
        user.email = email;
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}