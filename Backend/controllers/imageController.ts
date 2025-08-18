import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'Image uploaded successfully', imagePath: req.file?.path || req.file?.filename });
}

export const deleteImage = async (req: Request, res: Response) => {
    const { name } = req.params;
    const imagePath = path.join(__dirname, '../uploads/bikeImages', name);

    try {
        fs.unlinkSync(imagePath);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image', error });
    }
}