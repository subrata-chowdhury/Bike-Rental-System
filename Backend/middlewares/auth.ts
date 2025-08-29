import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || req.cookies.authorization;
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { [key: string]: any };
        req.headers.user = decoded.id;
        req.headers.role = decoded.role;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
