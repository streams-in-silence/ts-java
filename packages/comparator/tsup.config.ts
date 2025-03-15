import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/string.comparator.ts', 'src/patches.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
});
