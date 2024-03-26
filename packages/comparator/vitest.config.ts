import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*index.ts'],
      reporter: ['text', 'lcov'],
    },
  },
});
