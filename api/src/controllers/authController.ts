import { prisma } from '../prisma';
import { generateToken, hashPassword, comparePassword, sendError, sendSuccess } from '../utils';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide all fields');
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, 'User already exists');
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = generateToken(user.id);
    sendSuccess(res, { user, token });
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      return sendError(res, 401, 'Invalid credentials');
    }
    const token = generateToken(user.id);
    sendSuccess(res, { user, token });
  } catch {
    sendError(res, 500, 'Something went wrong');
  }
};

export const getMe = (req: Request, res: Response) => {
  sendSuccess(res, req.user);
};
