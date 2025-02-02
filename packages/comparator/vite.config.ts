import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@sis/ts-comparator',
      fileName: 'index',
    },
  },
  plugins: [dts({ tsconfigPath: resolve(__dirname, 'tsconfig.build.json') })],
});
