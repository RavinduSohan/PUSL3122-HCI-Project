import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import NavBar from '../../components/NavBar';

const pushMock = vi.fn();
const logoutMock = vi.fn();

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/dashboard',
}));

vi.mock('@/lib/store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: '1', email: 'admin@example.com', role: 'admin' },
    logout: logoutMock,
  }),
}));

describe('NavBar', () => {
  beforeEach(() => {
    pushMock.mockReset();
    logoutMock.mockReset();
  });

  it('renders primary navigation links for authenticated users', () => {
    render(<NavBar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Guide')).toBeInTheDocument();
    expect(screen.getByText('New Room')).toBeInTheDocument();
  });

  it('calls logout and redirects to login when clicking Logout', () => {
    render(<NavBar />);

    fireEvent.click(screen.getAllByRole('button', { name: /logout/i })[0]);

    expect(logoutMock).toHaveBeenCalledOnce();
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('shows user initials in profile avatar', () => {
    render(<NavBar />);

    expect(screen.getAllByText('AD')[0]).toBeInTheDocument();
  });
});
