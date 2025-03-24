import express from 'express';
import { getCurrentUser, Login, Register, updateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post("/login", Login);
router.post('/register', Register);
router.get('/me',protect, getCurrentUser);

router.put('/me', protect, upload.single('image'), updateUser);

export default router;