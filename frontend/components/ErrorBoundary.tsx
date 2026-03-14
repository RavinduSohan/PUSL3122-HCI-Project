'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional slot rendered in place of the crashed component. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * React error boundary that catches runtime exceptions in child components
 * and renders a friendly fallback instead of crashing the whole page.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<p>3D view failed to load.</p>}>
 *   <Scene3D ... />
 * </ErrorBoundary>
 * ```
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-700 mb-1">Something went wrong</p>
            <p className="text-xs text-red-400 max-w-xs wrap-break-word">{this.state.message}</p>
            <button
              className="mt-4 text-xs text-red-600 underline"
              onClick={() => this.setState({ hasError: false, message: '' })}
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
