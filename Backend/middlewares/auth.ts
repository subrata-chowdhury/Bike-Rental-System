import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envVariables from '../config/config';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, envVariables.jwtSecret) as { [key: string]: any };
        req.body += decoded;
        console.log(req.body);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
