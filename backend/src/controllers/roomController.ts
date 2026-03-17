import { NextFunction, Response } from 'express';
import Room from '../models/Room';
import Design from '../models/Design';
import { AuthRequest } from '../middleware/authenticate';

/** GET /api/rooms — returns all rooms owned by the authenticated user, sorted newest-first. */
export const getRooms = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rooms = await Room.find({ owner: req.user!.userId }).sort({ updatedAt: -1 });
    res.status(200).json({ data: rooms, message: 'Rooms fetched successfully' });
  } catch (err) { next(err); }
};

/** GET /api/rooms/:id — returns a single room plus its saved furniture design (if any). */
export const getRoomById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await Room.findOne({ _id: req.params.id, owner: req.user!.userId });
    if (!room) {
      res.status(404).json({ message: 'Room not found', code: 'NOT_FOUND', status: 404 });
      return;
    }
    const design = await Design.findOne({ room: room._id });
    res.status(200).json({ data: { room, design: design || null }, message: 'Room fetched successfully' });
  } catch (err) { next(err); }
};

/** POST /api/rooms — creates a new room for the authenticated user and returns it. */
export const createRoom = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, width, height, shape, wallColour } = req.body;
    const room = await Room.create({
      owner: req.user!.userId,
      name: name.trim(),
      width: Number(width),
      height: Number(height),
      shape: shape || 'rectangle',
      wallColour: wallColour || '#FFFFFF',
    });
    res.status(201).json({ data: room, message: 'Room created successfully' });
  } catch (err) { next(err); }
};

/** PUT /api/rooms/:id — updates mutable fields on a room (name, dimensions, colour, etc.). */
export const updateRoom = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!room) {
      res.status(404).json({ message: 'Room not found', code: 'NOT_FOUND', status: 404 });
      return;
    }
    res.status(200).json({ data: room, message: 'Room updated successfully' });
  } catch (err) { next(err); }
};

/** DELETE /api/rooms/:id — permanently removes the room and its associated furniture design. */
export const deleteRoom = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, owner: req.user!.userId });
    if (!room) {
      res.status(404).json({ message: 'Room not found', code: 'NOT_FOUND', status: 404 });
      return;
    }
    await Design.deleteOne({ room: room._id });
    res.status(200).json({ data: null, message: 'Room deleted successfully' });
  } catch (err) { next(err); }
};

/**
 * POST /api/rooms/:id/design — upserts the furniture layout for a room.
 * Also keeps `furnitureCount` on the Room document in sync.
 */
export const saveDesign = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await Room.findOne({ _id: req.params.id, owner: req.user!.userId });
    if (!room) {
      res.status(404).json({ message: 'Room not found', code: 'NOT_FOUND', status: 404 });
      return;
    }
    const { furnitureItems, thumbnailDataUrl } = req.body;

    // Strip any client-side _id so Mongoose generates clean ObjectIds for each subdoc
    const cleanedItems = (furnitureItems || []).map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ _id, ...item }: Record<string, unknown>) => item
    );

    const design = await Design.findOneAndUpdate(
      { room: room._id },
      { $set: { furnitureItems: cleanedItems, savedAt: new Date() } },
      { upsert: true, new: true },
    );
    await Room.findByIdAndUpdate(room._id, {
      furnitureCount: cleanedItems.length,
      ...(thumbnailDataUrl ? { thumbnailDataUrl } : {}),
    });
    res.status(200).json({ data: design, message: 'Design saved successfully' });
  } catch (err) { next(err); }
};

/** GET /api/rooms/admin/all — admin-only: returns all rooms across all users with owner info. */
export const getAllRoomsAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rooms = await Room.find({}).sort({ updatedAt: -1 }).populate('owner', 'email name');
    res.status(200).json({ data: rooms, message: 'All rooms fetched (admin)' });
  } catch (err) { next(err); }
};
