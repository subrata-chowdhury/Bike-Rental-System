import { NextFunction, Request, Response } from 'express';
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if(req.headers?.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
}