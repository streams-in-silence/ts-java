import { copyFile } from 'fs/promises';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@ts-java/comparator',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
  plugins: [
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.build.json'),
      rollupTypes: true,
      // to ensure that the types are also valid for the CommonJS build
      // we copy the generated types to a new file with a .cts extension
      afterBuild: () => copyFile('dist/index.d.ts', 'dist/index.d.cts'),
    }),
  ],
});
