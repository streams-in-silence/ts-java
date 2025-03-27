import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['dist', 'src/index.ts', '*.config.ts'],
      reporter: ['text', 'lcov'],
    },
  },
});
