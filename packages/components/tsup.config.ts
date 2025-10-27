import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    resolve: true
  },
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react/jsx-runtime', 'react-router', '@shopify/hydrogen']
});
