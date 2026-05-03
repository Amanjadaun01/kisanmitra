import express from 'express';
import { addComment, createPost, deletePost, getPosts, likePost } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', protect, createPost);
router.put('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comments', protect, addComment);
router.delete('/posts/:id', protect, deletePost);

export default router;
