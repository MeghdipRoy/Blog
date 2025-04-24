import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost
} from '../controllers/postController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);
router.get('/:id', getSinglePost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
