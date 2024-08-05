import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envVariables from '../config/config';
import User from '../models/user';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, envVariables.jwtSecret) as { [key: string]: any };
        req.body.user = decoded;
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.body.user.role = user.role;
        req.headers.role = user.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
