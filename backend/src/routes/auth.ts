import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// 15 attempts per 15 minutes per IP on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again in 15 minutes', code: 'RATE_LIMITED', status: 429 },
});

// POST /api/auth/register
router.post('/register', authLimiter, register);

// POST /api/auth/login
router.post('/login', authLimiter, login);

// GET /api/auth/me — profile + stats (authenticated)
router.get('/me', authenticate, getMe);

// PUT /api/auth/me/password — change password (authenticated)
router.put('/me/password', authenticate, changePassword);

export default router;
