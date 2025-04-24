import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import  { User } from '@prisma/client';
import { prisma } from '../prisma';
import { sendError } from '../utils';

// Type declaration extension
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: User;
//   }
// }

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return sendError(res, 401, 'Please authenticate');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return sendError(res, 401, 'User not found');
    }

    req.user = user; // Now properly typed
    next();
  } catch (error) {
    sendError(res, 401, 'Please authenticate');
  }
};

export default authMiddleware