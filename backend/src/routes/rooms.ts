import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  saveDesign,
  getAllRoomsAdmin,
} from '../controllers/roomController';
import { authenticate, authorize } from '../middleware/authenticate';
import { validate, createRoomSchema, updateRoomSchema } from '../middleware/validate';

const router = Router();

// All room routes require authentication
router.use(authenticate);

// Admin-only: get all rooms across all users
router.get('/admin/all', authorize('admin'), getAllRoomsAdmin);

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', validate(createRoomSchema), createRoom);
router.put('/:id', validate(updateRoomSchema), updateRoom);
router.delete('/:id', deleteRoom);
router.post('/:id/design', saveDesign);

export default router;
