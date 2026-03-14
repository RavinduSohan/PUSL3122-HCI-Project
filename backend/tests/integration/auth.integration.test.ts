import request from 'supertest';
import { beforeAll, afterAll, afterEach, describe, expect, it } from 'vitest';
import app from '../../src/app';
import User from '../../src/models/User';
import Room from '../../src/models/Room';
import Design from '../../src/models/Design';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../helpers/mongo';

describe('auth routes', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  it('registers a user and seeds starter data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'newuser@example.com',
      password: 'secret123',
    });

    expect(res.status).toBe(201);
    expect(res.body?.data?.token).toBeTruthy();

    const users = await User.find({});
    const rooms = await Room.find({});
    const designs = await Design.find({});

    expect(users).toHaveLength(1);
    expect(rooms).toHaveLength(1);
    expect(designs).toHaveLength(1);
  });

  it('logs in and reads profile with bearer token', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'loginuser@example.com',
      password: 'secret123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'loginuser@example.com',
      password: 'secret123',
    });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body?.data?.token as string;
    expect(token).toBeTruthy();

    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body?.data?.user?.email).toBe('loginuser@example.com');
    expect(typeof meRes.body?.data?.stats?.rooms).toBe('number');
  });
});
