/**
 * Seed script — run with: npm run seed
 *
 * Seeded credentials (for dev/demo only):
 *   Admin: admin@shop.com / admin123
 *   User:  user@home.com  / user123
 *
 * Safe to re-run: only wipes / recreates the two seed accounts and their
 * rooms. All other user accounts and their designs are left untouched.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './db/connection';
import User from './models/User';
import Room from './models/Room';
import Design from './models/Design';

const SEED_EMAILS = ['admin@shop.com', 'user@home.com'];

const seed = async () => {
  await connectDB();

  // Remove only the seed accounts (leave any real user accounts intact)
  const seedUsers = await User.find({ email: { $in: SEED_EMAILS } });
  if (seedUsers.length) {
    const seedIds = seedUsers.map((u) => u._id);
    const seedRooms = await Room.find({ owner: { $in: seedIds } });
    const seedRoomIds = seedRooms.map((r) => r._id);
    await Design.deleteMany({ room: { $in: seedRoomIds } });
    await Room.deleteMany({ owner: { $in: seedIds } });
    await User.deleteMany({ _id: { $in: seedIds } });
    console.log('🗑️  Removed existing seed accounts and their data');
  }

  // Re-create seed users
  const admin = await User.create({ email: 'admin@shop.com', password: 'admin123', role: 'admin' });
  const user  = await User.create({ email: 'user@home.com',  password: 'user123',  role: 'user'  });
  console.log(`👤 Created admin: ${admin.email}`);
  console.log(`👤 Created user:  ${user.email}`);

  // ── Room 1 — Open-Plan Living Area ────────────────────────────────────────
  const room1 = await Room.create({ owner: user._id, name: 'Open-Plan Living Area', width: 7, height: 5, shape: 'rectangle', wallColour: '#F5F0E8', furnitureCount: 9 });
  await Design.create({ room: room1._id, savedAt: new Date(), furnitureItems: [
    { furnitureType: 'sofa',         label: 'Sofa',          x: 30,  y: 40,  width: 150, height: 60,  colour: '#8B6F47', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Armchair',      x: 200, y: 30,  width: 70,  height: 70,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Armchair 2',    x: 200, y: 120, width: 70,  height: 70,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'coffee-table', label: 'Coffee Table',  x: 80,  y: 120, width: 80,  height: 40,  colour: '#6B4226', rotation: 0 },
    { furnitureType: 'tv-unit',      label: 'TV Unit',       x: 30,  y: 10,  width: 120, height: 30,  colour: '#4A4A4A', rotation: 0 },
    { furnitureType: 'dining-table', label: 'Dining Table',  x: 300, y: 40,  width: 120, height: 70,  colour: '#7D5A3C', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Dining Chair 1',x: 280, y: 130, width: 50,  height: 50,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Dining Chair 2',x: 350, y: 130, width: 50,  height: 50,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Bookshelf',     x: 300, y: 200, width: 90,  height: 25,  colour: '#6E5A3E', rotation: 0 },
  ]});

  // ── Room 2 — Master Bedroom ───────────────────────────────────────────────
  const room2 = await Room.create({ owner: user._id, name: 'Master Bedroom', width: 5, height: 5, shape: 'rectangle', wallColour: '#E8EFF5', furnitureCount: 8 });
  await Design.create({ room: room2._id, savedAt: new Date(), furnitureItems: [
    { furnitureType: 'bed-double',   label: 'King Bed',      x: 80,  y: 30,  width: 160, height: 180, colour: '#8C7B6B', rotation: 0 },
    { furnitureType: 'wardrobe',     label: 'Wardrobe',      x: 10,  y: 30,  width: 60,  height: 120, colour: '#5C4A32', rotation: 0 },
    { furnitureType: 'wardrobe',     label: 'Wardrobe 2',    x: 260, y: 30,  width: 60,  height: 120, colour: '#5C4A32', rotation: 0 },
    { furnitureType: 'desk',         label: 'Vanity Desk',   x: 10,  y: 180, width: 100, height: 50,  colour: '#7A6548', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Reading Chair', x: 200, y: 200, width: 70,  height: 70,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Bedside L',     x: 60,  y: 30,  width: 25,  height: 35,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Bedside R',     x: 240, y: 30,  width: 25,  height: 35,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'tv-unit',      label: 'TV Unit',       x: 100, y: 240, width: 100, height: 30,  colour: '#4A4A4A', rotation: 0 },
  ]});

  // ── Room 3 — Home Office ──────────────────────────────────────────────────
  const room3 = await Room.create({ owner: user._id, name: 'Home Office', width: 4, height: 4, shape: 'rectangle', wallColour: '#EDF2EE', furnitureCount: 8 });
  await Design.create({ room: room3._id, savedAt: new Date(), furnitureItems: [
    { furnitureType: 'desk',         label: 'Main Desk',     x: 20,  y: 20,  width: 120, height: 60,  colour: '#7A6548', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Desk Chair',    x: 50,  y: 100, width: 60,  height: 60,  colour: '#4A4A4A', rotation: 0 },
    { furnitureType: 'desk',         label: 'Side Desk',     x: 160, y: 20,  width: 80,  height: 50,  colour: '#7A6548', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Shelf A',       x: 20,  y: 180, width: 90,  height: 25,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Shelf B',       x: 120, y: 180, width: 90,  height: 25,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Shelf C',       x: 20,  y: 210, width: 90,  height: 25,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Guest Chair',   x: 200, y: 120, width: 65,  height: 65,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'coffee-table', label: 'Side Table',    x: 190, y: 80,  width: 50,  height: 50,  colour: '#6B4226', rotation: 0 },
  ]});

  // ── Room 4 — Guest Room ───────────────────────────────────────────────────
  const room4 = await Room.create({ owner: user._id, name: 'Guest Room', width: 4, height: 3, shape: 'rectangle', wallColour: '#FFF5EC', furnitureCount: 6 });
  await Design.create({ room: room4._id, savedAt: new Date(), furnitureItems: [
    { furnitureType: 'bed-single',   label: 'Single Bed',    x: 20,  y: 20,  width: 90,  height: 160, colour: '#9E8C7C', rotation: 0 },
    { furnitureType: 'wardrobe',     label: 'Wardrobe',      x: 140, y: 20,  width: 80,  height: 50,  colour: '#5C4A32', rotation: 0 },
    { furnitureType: 'desk',         label: 'Study Desk',    x: 140, y: 90,  width: 100, height: 50,  colour: '#7A6548', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Chair',         x: 140, y: 155, width: 60,  height: 60,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Bedside',       x: 20,  y: 190, width: 30,  height: 35,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'tv-unit',      label: 'TV Stand',      x: 20,  y: 140, width: 80,  height: 25,  colour: '#4A4A4A', rotation: 0 },
  ]});

  // ── Room 5 — L-Shape Studio ───────────────────────────────────────────────
  const room5 = await Room.create({ owner: user._id, name: 'Studio Flat', width: 6, height: 6, shape: 'l-shape', wallColour: '#F0EBE3', furnitureCount: 9 });
  await Design.create({ room: room5._id, savedAt: new Date(), furnitureItems: [
    { furnitureType: 'sofa',         label: 'Sofa',          x: 20,  y: 20,  width: 150, height: 60,  colour: '#8B6F47', rotation: 0 },
    { furnitureType: 'coffee-table', label: 'Coffee Table',  x: 50,  y: 100, width: 80,  height: 40,  colour: '#6B4226', rotation: 0 },
    { furnitureType: 'tv-unit',      label: 'TV Unit',       x: 20,  y: 170, width: 120, height: 30,  colour: '#4A4A4A', rotation: 0 },
    { furnitureType: 'bed-double',   label: 'Bed',           x: 200, y: 180, width: 140, height: 160, colour: '#8C7B6B', rotation: 0 },
    { furnitureType: 'wardrobe',     label: 'Wardrobe',      x: 200, y: 150, width: 100, height: 30,  colour: '#5C4A32', rotation: 0 },
    { furnitureType: 'desk',         label: 'Desk',          x: 20,  y: 240, width: 100, height: 50,  colour: '#7A6548', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Armchair',      x: 180, y: 50,  width: 70,  height: 70,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Shelf',         x: 20,  y: 300, width: 90,  height: 25,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'dining-table', label: 'Dining Table',  x: 180, y: 250, width: 100, height: 60,  colour: '#7D5A3C', rotation: 0 },
  ]});

  // ── Room 6 — Showroom (L-shape, admin) ───────────────────────────────────
  const room6 = await Room.create({ owner: admin._id, name: 'Showroom Layout A', width: 9, height: 7, shape: 'l-shape', wallColour: '#FFFFFF', furnitureCount: 10 });
  await Design.create({ room: room6._id, savedAt: new Date(), furnitureItems: [
    { furnitureType: 'sofa',         label: 'Display Sofa',  x: 30,  y: 30,  width: 180, height: 70,  colour: '#6B4226', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Armchair L',    x: 30,  y: 120, width: 75,  height: 75,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Armchair R',    x: 230, y: 30,  width: 75,  height: 75,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'coffee-table', label: 'Coffee Table',  x: 100, y: 120, width: 100, height: 50,  colour: '#8B6F47', rotation: 0 },
    { furnitureType: 'dining-table', label: 'Dining Set',    x: 350, y: 30,  width: 150, height: 80,  colour: '#7D5A3C', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Chair A',       x: 330, y: 130, width: 55,  height: 55,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'armchair',     label: 'Chair B',       x: 400, y: 130, width: 55,  height: 55,  colour: '#9B7E5A', rotation: 0 },
    { furnitureType: 'bookshelf',    label: 'Display Shelf', x: 30,  y: 250, width: 120, height: 30,  colour: '#6E5A3E', rotation: 0 },
    { furnitureType: 'wardrobe',     label: 'Cabinet A',     x: 30,  y: 300, width: 100, height: 50,  colour: '#5C4A32', rotation: 0 },
    { furnitureType: 'tv-unit',      label: 'Media Unit',    x: 200, y: 250, width: 140, height: 35,  colour: '#4A4A4A', rotation: 0 },
  ]});

  [room1, room2, room3, room4, room5, room6].forEach((r) => console.log(`🏠 Created room: ${r.name}`));
  console.log('\n✅ Seed complete!');
  console.log('---');
  console.log('Admin login: admin@shop.com / admin123');
  console.log('User login:  user@home.com  / user123');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
