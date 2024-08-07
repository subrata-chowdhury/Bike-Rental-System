import { Request, Response } from 'express';
import Bike from '../models/bike';
import fs from 'fs';
import path from 'path';
import { isAdmin } from './roleChecker';

// GET /bikes
export const getAllBikes = async (req: Request, res: Response) => {
    try {
        const bikes = await Bike.find();
        res.status(200).json(bikes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /bikes/total
export const getBikeCount = async (req: Request, res: Response) => {
    const filterData = req.body.filterData;
    const searchData = req.body.searchData;
    if (filterData && Object.keys(filterData).length > 0) {
        Object.keys(filterData).map((key: string) => {
            if (filterData[key].length === 0) {
                delete filterData[key];
            }
        });
        Object.keys(filterData).map((key: string) => {
            filterData[key] = { $in: filterData[key] };
        })
    }
    if (searchData && searchData.length > 0) {
        filterData.bikeModel = { $regex: searchData, $options: 'i' };
    }

    try {
        const total: number = await Bike.countDocuments({ ...filterData });
        res.status(200).json({ total: total });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /bikes/:index/:limit
export const getBikesByIndexAndLimit = async (req: Request, res: Response) => {
    const { index } = req.params;

    const filterData = req.body.filterData;
    const searchData = req.body.searchData;
    if (filterData && Object.keys(filterData).length > 0) {
        Object.keys(filterData).map((key: string) => {
            if (filterData[key].length === 0) {
                delete filterData[key];
            }
        });
        Object.keys(filterData).map((key: string) => {
            filterData[key] = { $in: filterData[key] };
        })
    }
    if (searchData && searchData.length > 0) {
        filterData.bikeModel = { $regex: searchData, $options: 'i' };
    }

    try {
        const bikes = await Bike.find({ ...filterData }).skip(parseInt(index)).limit(6);
        res.status(200).json(bikes);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /bikes/:id
export const getBikeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const bike = await Bike.findById(id);
        if (!bike) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.status(200).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTypes = async (req: Request, res: Response) => {
    try {
        const types = await Bike.aggregate([
            { $group: { _id: null, brand: { $addToSet: "$brand" }, cc: { $addToSet: "$cc" }, horsePower: { $addToSet: "$horsePower" }, type: { $addToSet: "$type" } } },
            { $project: { _id: 0, brand: 1, cc: 1, horsePower: 1, type: 1 } }
        ]);
        res.status(200).json(types[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}




// ADMIN CONTOLS





// POST /bikes
export const createBike = async (req: Request, res: Response) => {
    if (!isAdmin(req)) return res.status(403).json({ message: 'Unauthorized' });
    const { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type } = req.body;

    // Verify data
    if (!bikeModel || !pricePerHour || !isAvailable || !brand || !cc || !horsePower || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const imageFile = req.file;

    // if (!imageFile) {
    //     return res.status(400).send('No file uploaded.');
    // }
    try {
        const bike = await Bike.create({ bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type, imageURL: imageFile ? (imageFile?.filename) : "" });
        res.status(201).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /bikes/:id
export const updateBike = async (req: Request, res: Response) => {
    if (!isAdmin(req)) return res.status(403).json({ message: 'Unauthorized' });
    const { bikeId } = req.params;
    const { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type } = req.body;

    // Verify data
    if (!bikeModel || !pricePerHour || !isAvailable || !brand || !cc || !horsePower || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const imageFile = req.file;
    // if (!imageFile) {
    //     return res.status(400).send('No file uploaded.');
    // }

    try {
        const bike = await Bike.findByIdAndUpdate(bikeId, { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type, imageURL: imageFile ? imageFile.filename : "" }, { new: true });
        if (!bike) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.status(200).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /bikes/:id
export const deleteBike = async (req: Request, res: Response) => {
    if (!isAdmin(req)) return res.status(403).json({ message: 'Unauthorized' });
    const { bikeId } = req.params;
    try {
        const bike = await Bike.findByIdAndDelete(bikeId);
        if (!bike) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        if (bike.imageURL) {
            const imagePath = path.join(__dirname, '../uploads/bikeImages', bike.imageURL);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Internal server error' });
                }
            });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};