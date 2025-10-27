import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true
  },
  clean: true,
  treeshake: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ['react', 'react-i18next', 'i18next', 'i18next-browser-languagedetector']
});
