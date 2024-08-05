import { Request } from 'express';
export function isAdmin(req: Request) {
    if(req.headers?.role === 'admin')
        return true;
    return false;
}