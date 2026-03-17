import request from 'supertest';
import { Types } from 'mongoose';
import { beforeAll, afterAll, afterEach, describe, expect, it } from 'vitest';
import app from '../../src/app';
import User from '../../src/models/User';
import Design from '../../src/models/Design';
import { generateToken } from '../../src/utils/jwt';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../helpers/mongo';

describe('rooms routes', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it('validates room creation payload', async () => {
    const user = await User.create({
      email: 'validator@example.com',
      password: 'secret123',
      role: 'user',
    });
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Invalid Room',
        width: 6,
        height: 5,
        shape: 'rectangle',
        wallColour: 'not-hex',
      });

    expect(res.status).toBe(400);
    expect(res.body?.code).toBe('VALIDATION_ERROR');
  });

  it('supports create, update, save design, list and delete flow', async () => {
    const user = await User.create({
      email: 'roomuser@example.com',
      password: 'secret123',
      role: 'user',
    });
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const createRes = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Living Room',
        width: 6,
        height: 5,
        shape: 'rectangle',
        wallColour: '#FFFFFF',
      });

    expect(createRes.status).toBe(201);
    const roomId = createRes.body?.data?._id as string;
    expect(roomId).toBeTruthy();

    const listRes = await request(app).get('/api/rooms').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body?.data).toHaveLength(1);

    const updateRes = await request(app)
      .put(`/api/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Room' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body?.data?.name).toBe('Updated Room');

    const saveDesignRes = await request(app)
      .post(`/api/rooms/${roomId}/design`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        furnitureItems: [
          {
            _id: new Types.ObjectId().toString(),
            furnitureType: 'sofa',
            x: 10,
            y: 10,
            width: 20,
            height: 10,
            colour: '#111111',
            rotation: 0,
            label: 'Main Sofa',
          },
        ],
      });
    expect(saveDesignRes.status).toBe(200);

    const design = await Design.findOne({ room: roomId });
    expect(design?.furnitureItems).toHaveLength(1);
    expect((design?.furnitureItems?.[0] as { _id?: unknown })?._id).toBeDefined();

    const deleteRes = await request(app)
      .delete(`/api/rooms/${roomId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    const deletedDesign = await Design.findOne({ room: roomId });
    expect(deletedDesign).toBeNull();
  });
});
