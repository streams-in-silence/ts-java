import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/string.comparator.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
});
