import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../../components/ErrorBoundary';

function Thrower(): ReactElement {
  throw new Error('boom');
}

function SafeChild(): ReactElement {
  return <div>safe child</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('safe child')).toBeInTheDocument();
  });

  it('renders default fallback when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/boom/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Fallback = 'Custom fallback';

    render(
      <ErrorBoundary fallback={<div>{Fallback}</div>}>
        <Thrower />
      </ErrorBoundary>
    );

    expect(screen.getByText(Fallback)).toBeInTheDocument();

    spy.mockRestore();
  });
});
