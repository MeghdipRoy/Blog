import { prisma } from '../prisma';
import { sendError, sendSuccess } from '../utils';
import { Request, Response } from 'express';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return sendError(res, 400, 'Please provide title and content');
    if (!req.user?.id) return;

    const post = await prisma.post.create({
      data: { title, content, userId: req.user.id },
    });
    sendSuccess(res, post);
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};

export const getAllPosts = async (_: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    sendSuccess(res, posts);
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!post) return sendError(res, 404, 'Post not found');
    sendSuccess(res, post);
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return sendError(res, 400, 'Please provide title and content');
    const post = await prisma.post.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!post) return sendError(res, 404, 'Post not found');
    if (post.userId !== req.user?.id) return sendError(res, 403, 'Not authorized to update this post');

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: { title, content },
    });
    sendSuccess(res, updatedPost);
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!post) return sendError(res, 404, 'Post not found');
    if (post.userId !== req.user?.id) return sendError(res, 403, 'Not authorized to delete this post');
    await prisma.post.delete({ where: { id: post.id } });
    sendSuccess(res, { message: 'Post deleted successfully' });
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};
