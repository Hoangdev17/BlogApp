import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addCommentToPost, createPost, deleteCommentFromPost, deletePost, dislikePost, getAllPosts, getPostById, likePost, updatePost, uploadImages } from '../controllers/postController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.post("/:id/comments",protect, addCommentToPost);
router.delete("/:id/comments/:commentId",protect, deleteCommentFromPost);
router.put("/:id/like", protect, likePost);
router.put('/:id/dislike', protect, dislikePost);
router.post("/upload", protect, upload.single('image'), uploadImages);

export default router;