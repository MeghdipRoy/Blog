import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { sendError } from '../utils';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return sendError(res, 401, 'Please authenticate');

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return sendError(res, 401, 'User not found');

    req.user = user; // Type-safe via global declaration
    next();
  } catch (error) {
    sendError(res, 401, 'Please authenticate');
  }
};