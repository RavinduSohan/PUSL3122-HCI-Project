'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => { document.title = '404 — Page Not Found | FurniView'; }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="text-8xl mb-6 select-none">🪑</div>

        {/* Copy */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404 — Not Found</h1>
        <p className="text-gray-500 text-sm mb-8">
          This page doesn&apos;t exist, or the room you&apos;re looking for may have been deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to My Rooms
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
