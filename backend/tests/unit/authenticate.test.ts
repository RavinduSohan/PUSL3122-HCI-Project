import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Response } from 'express';
import { authenticate, AuthRequest } from '../../src/middleware/authenticate';
import { generateToken } from '../../src/utils/jwt';

function createRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

describe('authenticate middleware', () => {
  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} } as AuthRequest;
    const res = createRes();
    const next = vi.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for malformed Authorization header', () => {
    const req = { headers: { authorization: 'Token 123' } } as AuthRequest;
    const res = createRes();
    const next = vi.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user and calls next on valid token', () => {
    const token = generateToken({
      userId: 'u1',
      email: 'u1@example.com',
      role: 'admin',
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = createRes();
    const next = vi.fn() as NextFunction;

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toBeDefined();
    expect(req.user?.role).toBe('admin');
  });
});
