import { Request, Response } from 'express';
import Bike from '../models/bike';
import fs from 'fs';
import path from 'path';

// GET /bikes/:index/:limit
export const getBikesByIndexAndLimit = async (req: Request, res: Response) => {
    const { index } = req.params;
    const searchData = req.url.split('?')[1] ? new URLSearchParams(req.url.split('?')[1]) : new URLSearchParams();
    const filterData = JSON.parse(searchData.get('filter') || '{}');
    const search = filterData.search || '';
    const maxPrice: number | null = filterData?.maxPricePerHour ?? null;
    if(filterData?.maxPricePerHour) delete filterData.maxPricePerHour;
    if(filterData?.search) delete filterData.search;
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
    if (search && search.length > 0) {
        filterData.bikeModel = { $regex: search, $options: 'i' };
    }
    if (maxPrice !== null) {
        filterData.pricePerHour = { ...(filterData.pricePerHour || {}), $lte: maxPrice };
    }

    try {
        const bikes = await Bike.find({ ...filterData }).skip(parseInt(index)).limit(6);
        const count = await Bike.countDocuments({ ...filterData })
        res.status(200).json({ bikes: bikes, totalBikes: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /bikes/:id
export const getBikeById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const bike = await Bike.findById(id);
        if (!bike) {
            res.status(404).json({ message: 'Bike not found' });
            return;
        }
        res.status(200).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFilterData = async (req: Request, res: Response) => {
    try {
        const types = await Bike.aggregate([
            {
                $group: {
                    _id: null,
                    brand: { $addToSet: "$brand" },
                    cc: { $addToSet: "$cc" },
                    horsePower: { $addToSet: "$horsePower" },
                    type: { $addToSet: "$type" },
                    minPricePerHour: { $min: "$pricePerHour" },
                    maxPricePerHour: { $max: "$pricePerHour" }
                }
            },
            {
                $project: {
                    _id: 0,
                    brand: 1,
                    cc: 1,
                    horsePower: 1,
                    type: 1,
                    minPricePerHour: 1,
                    maxPricePerHour: 1
                }
            }
        ]);
        res.status(200).json(types[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}




// ADMIN CONTOLS





// POST /bikes
export const createBike = async (req: Request, res: Response) => {
    const { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type, images } = req.body;

    // Verify data
    if (!bikeModel || !pricePerHour || !isAvailable || !brand || !cc || !horsePower || !type) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const bike = await Bike.create({ bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type, images });
        res.status(201).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /bikes/:id
export const updateBike = async (req: Request, res: Response) => {
    const { bikeId } = req.params;
    const { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type } = req.body;

    // Verify data
    if (!bikeModel || !pricePerHour || !isAvailable || !brand || !cc || !horsePower || !type) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    const imageFile = req.file;
    // if (!imageFile) {
    //     return res.status(400).send('No file uploaded.');
    // }

    try {
        const bike = await Bike.findByIdAndUpdate(bikeId, { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type, imageURL: imageFile ? imageFile.filename : "" }, { new: true });
        if (!bike) {
            res.status(404).json({ message: 'Bike not found' });
            return;
        }
        res.status(200).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /bikes/:id
export const deleteBike = async (req: Request, res: Response) => {
    const { bikeId } = req.params;
    try {
        const bike = await Bike.findByIdAndDelete(bikeId);
        if (!bike) {
            res.status(404).json({ message: 'Bike not found' });
            return;
        }
        if (bike.images) {
            bike.images.forEach((imageURL: string) => {
                const imagePath = path.join(__dirname, '../uploads/bikeImages', imageURL);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ message: 'Internal server error' });
                    }
                });
            });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};