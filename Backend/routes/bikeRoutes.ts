import express from 'express';
import { getBikesByIndexAndLimit, createBike, deleteBike, getFilterData, updateBike, getBikeById } from '../controllers/bikeController';
import authMiddleware from '../middlewares/auth';
import multer from 'multer';
import path from 'path';
import { isAdmin } from '../controllers/roleChecker';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/bikeImages'); // Directory to save files
    },
    filename: function (req, file, cb) {
        const { bikeModel } = req.body;
        const name = bikeModel + ' (' + Date.now() + ')' + path.extname(file.originalname);
        cb(null, name); // Add a timestamp to avoid name conflicts
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', getFilterData);
router.get('/:index', getBikesByIndexAndLimit);
router.get('/details/:id', getBikeById);


// ADMIN ROUTES

router.post('/new', authMiddleware, isAdmin, upload.single('image'), createBike);
router.put('/update/:bikeId', authMiddleware, isAdmin, upload.single('image'), updateBike);
router.delete('/delete/:bikeId', authMiddleware, isAdmin, deleteBike);

export default router;
