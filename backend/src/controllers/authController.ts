import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import Room from '../models/Room';
import Design from '../models/Design';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authenticate';

/**
 * POST /api/auth/register — creates a new user account, seeds a starter room,
 * and returns a JWT.  Returns 409 if the email is already registered.
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required', code: 'VALIDATION_ERROR', status: 400 });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: 'Email already registered', code: 'DUPLICATE_EMAIL', status: 409 });
      return;
    }

    const user = await User.create({ email, password, role: role || 'user' });

    // Give new users a sample living room to explore immediately
    const starterRoom = await Room.create({
      owner: user._id,
      name: 'Sample Living Room',
      width: 6,
      height: 5,
      shape: 'rectangle',
      wallColour: '#F5F0E8',
      furnitureCount: 5,
    });
    await Design.create({
      room: starterRoom._id,
      savedAt: new Date(),
      furnitureItems: [
        { furnitureType: 'sofa',         label: 'Sofa',         x: 45,  y: 50,  width: 150, height: 60, colour: '#8B6F47', rotation: 0 },
        { furnitureType: 'coffee-table', label: 'Coffee Table', x: 90,  y: 130, width: 80,  height: 40, colour: '#6B4226', rotation: 0 },
        { furnitureType: 'armchair',     label: 'Armchair',     x: 215, y: 45,  width: 70,  height: 70, colour: '#9B7E5A', rotation: 0 },
        { furnitureType: 'tv-unit',      label: 'TV Unit',      x: 45,  y: 15,  width: 120, height: 30, colour: '#4A4A4A', rotation: 0 },
        { furnitureType: 'bookshelf',    label: 'Bookshelf',    x: 270, y: 130, width: 90,  height: 25, colour: '#6E5A3E', rotation: 0 },
      ],
    });

    const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

    res.status(201).json({
      data: { token, user: { id: user._id, email: user.email, role: user.role } },
      message: 'Account created successfully',
    });
  } catch (err) { next(err); }
};

/**
 * POST /api/auth/login — validates credentials and returns a JWT on success.
 * Returns 401 for any credential mismatch (email not found or wrong password).
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required', code: 'VALIDATION_ERROR', status: 400 });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS', status: 401 });
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(401).json({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS', status: 401 });
      return;
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

    res.status(200).json({
      data: { token, user: { id: user._id, email: user.email, role: user.role } },
      message: 'Login successful',
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/auth/me — returns the authenticated user's profile + aggregate stats.
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found', code: 'NOT_FOUND', status: 404 });
      return;
    }
    const rooms = await Room.find({ owner: user._id });
    const roomIds = rooms.map((r) => r._id);
    const designs = await Design.find({ room: { $in: roomIds } });
    const totalFurniture = designs.reduce((s, d) => s + (d.furnitureItems?.length ?? 0), 0);

    res.status(200).json({
      data: {
        user: { id: user._id, email: user.email, role: user.role, createdAt: (user as { createdAt?: Date }).createdAt },
        stats: { rooms: rooms.length, totalFurniture },
      },
      message: 'Profile fetched',
    });
  } catch (err) { next(err); }
};

/**
 * PUT /api/auth/me/password — changes the authenticated user's password.
 * Requires currentPassword + newPassword (min 6 chars).
 */
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'currentPassword and newPassword are required', code: 'VALIDATION_ERROR', status: 400 });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters', code: 'VALIDATION_ERROR', status: 400 });
      return;
    }
    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found', code: 'NOT_FOUND', status: 404 });
      return;
    }
    const match = await user.comparePassword(currentPassword);
    if (!match) {
      res.status(401).json({ message: 'Current password is incorrect', code: 'INVALID_CREDENTIALS', status: 401 });
      return;
    }
    user.password = newPassword;
    await user.save(); // triggers bcrypt pre-save hook
    res.status(200).json({ data: null, message: 'Password changed successfully' });
  } catch (err) { next(err); }
};
