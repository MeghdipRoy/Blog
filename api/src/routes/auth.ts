import { Router } from 'express';
import { prisma } from '../prisma';
import { generateToken, hashPassword, comparePassword, sendError, sendSuccess } from '../utils';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Register
router.post('/register', async (req, res) => {
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
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user.id);
    sendSuccess(res, { user, token });
  } catch (error) {
    sendError(res, 500, 'Something went wrong');
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  sendSuccess(res, req.user);
});

export default router;