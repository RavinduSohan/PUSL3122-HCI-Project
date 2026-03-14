import { describe, expect, it } from 'vitest';
import { generateToken, verifyToken, JwtPayload } from '../../src/utils/jwt';

describe('jwt utils', () => {
  it('generates and verifies a token payload', () => {
    const payload: JwtPayload = {
      userId: 'abc123',
      email: 'user@example.com',
      role: 'user',
    };

    const token = generateToken(payload);
    const decoded = verifyToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('throws for an invalid token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow();
  });
});
