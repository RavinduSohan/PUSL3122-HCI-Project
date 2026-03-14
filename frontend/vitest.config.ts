import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'components/ErrorBoundary.tsx',
        'components/NavBar.tsx',
        'lib/**/*.ts',
      ],
      exclude: [
        'components/Canvas2D.tsx',
        'components/DesignCard.tsx',
        'components/Scene3D.tsx',
      ],
    },
  },
});
