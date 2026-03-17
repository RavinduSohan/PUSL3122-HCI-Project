import { beforeEach, describe, expect, it } from 'vitest';
import api from '../../lib/api';

describe('api client interceptors', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, href: 'http://localhost/' },
    });
  });

  it('attaches bearer token from localStorage to request headers', async () => {
    localStorage.setItem('token', 'token-abc');

    api.defaults.adapter = async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });

    const res = await api.get('/health');
    const authHeader = (res.config.headers as Record<string, string>)?.Authorization;

    expect(authHeader).toBe('Bearer token-abc');
  });

  it('clears auth storage on 401 responses', async () => {
    localStorage.setItem('token', 'token-abc');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'x@y.com', role: 'user' }));

    api.defaults.adapter = async (config) => {
      throw {
        response: { status: 401 },
        config,
      };
    };

    await expect(api.get('/protected')).rejects.toBeDefined();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
