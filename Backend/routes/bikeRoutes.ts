import express from 'express';
import { getBikesByIndexAndLimit, createBike, deleteBike, getFilterData, updateBike, getBikeById } from '../controllers/bikeController';
import authMiddleware from '../middlewares/auth';
import multer from 'multer';
import path from 'path';
import { isAdmin } from '../controllers/roleChecker';
import { deleteImage, uploadImage } from '../controllers/imageController';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/bikeImages'); // Directory to save files
    },
    filename: function (req, file, cb) {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name); // Add a timestamp to avoid name conflicts
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', getFilterData);
router.get('/:index', getBikesByIndexAndLimit);
router.get('/details/:id', getBikeById);


// ADMIN ROUTES

router.post('/upload/new', authMiddleware, isAdmin, upload.single('image'), uploadImage);
router.delete('/upload/:name', authMiddleware, isAdmin, upload.single('image'), deleteImage);
router.post('/new', authMiddleware, isAdmin, createBike);
router.put('/update/:bikeId', authMiddleware, isAdmin, updateBike);
router.delete('/delete/:bikeId', authMiddleware, isAdmin, deleteBike);

export default router;
