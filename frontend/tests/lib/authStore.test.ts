import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../../lib/store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('persists token and user on login', () => {
    const state = useAuthStore.getState();
    state.login('token-123', { id: '1', email: 'u@example.com', role: 'user' });

    const next = useAuthStore.getState();
    expect(next.isAuthenticated).toBe(true);
    expect(next.token).toBe('token-123');
    expect(localStorage.getItem('token')).toBe('token-123');
  });

  it('restores auth state from localStorage', () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'a@b.com', role: 'admin' }));

    useAuthStore.getState().loadFromStorage();

    const next = useAuthStore.getState();
    expect(next.isAuthenticated).toBe(true);
    expect(next.user?.role).toBe('admin');
  });

  it('clears state and storage on logout', () => {
    useAuthStore.getState().login('token-123', { id: '1', email: 'u@example.com', role: 'user' });

    useAuthStore.getState().logout();

    const next = useAuthStore.getState();
    expect(next.isAuthenticated).toBe(false);
    expect(next.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
