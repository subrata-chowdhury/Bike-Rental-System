import express from 'express';
import { getBikesByIndexAndLimit, getBikeCount, createBike, deleteBike, getTypes, updateBike } from '../controllers/bikeController';
import authMiddleware from '../middlewares/auth';
import multer from 'multer';
import path from 'path';

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

router.post('/', authMiddleware, getBikeCount);
router.get('/', getTypes);
router.post('/:index', authMiddleware, getBikesByIndexAndLimit);
router.post('/new/newBike', authMiddleware, upload.single('image'), createBike);
router.put('/update/:bikeId', authMiddleware, upload.single('image'), updateBike);
router.delete('/delete/:bikeId', authMiddleware, deleteBike);

export default router;
