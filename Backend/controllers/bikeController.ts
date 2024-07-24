import { Request, Response } from 'express';
import Bike from '../models/bike';

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

// POST /bikes
export const createBike = async (req: Request, res: Response) => {
    const { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type } = req.body;
    try {
        const bike = await Bike.create({ bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type });
        res.status(201).json(bike);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /bikes/:id
export const updateBike = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type } = req.body;
    try {
        const bike = await Bike.findByIdAndUpdate(id, { bikeModel, pricePerHour, isAvailable, brand, cc, horsePower, type }, { new: true });
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
    const { id } = req.params;
    try {
        const bike = await Bike.findByIdAndDelete(id);
        if (!bike) {
            return res.status(404).json({ message: 'Bike not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTypes = async (req: Request, res: Response) => {
    try {
        const distinctValuesOfBrand = await Bike.distinct('brand');
        const distinctValuesOfCc = await Bike.distinct('cc');
        const distinctValuesOfHorsePower = await Bike.distinct('horsePower');
        const distinctValuesOfType = await Bike.distinct('type');
        const types = {
            brand: distinctValuesOfBrand,
            cc: distinctValuesOfCc,
            type: distinctValuesOfType,
            horsePower: distinctValuesOfHorsePower
        };
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}