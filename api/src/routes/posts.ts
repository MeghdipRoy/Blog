import { Router } from 'express';
import { prisma } from '../prisma'; 
import { sendError, sendSuccess } from '../utils';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return sendError(res, 400, 'Please provide title and content');
    }

    if(!req.user?.id){
      return
    }

    const post = await prisma.post.create({
      data: {
        title: String(title),
        content: String(content),
        userId:req.user?.id
      },
    });

    sendSuccess(res, post);
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    sendSuccess(res, posts);
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    sendSuccess(res, post);
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

// Update post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return sendError(res, 400, 'Please provide title and content');
    }

    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.userId !== req.user?.id) {
      return sendError(res, 403, 'Not authorized to update this post');
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { title, content },
    });

    sendSuccess(res, updatedPost);
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    if (post.userId !== req.user?.id) {
      return sendError(res, 403, 'Not authorized to delete this post');
    }

    await prisma.post.delete({ where: { id: post.id } });
    sendSuccess(res, { message: 'Post deleted successfully' });
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

export default router;