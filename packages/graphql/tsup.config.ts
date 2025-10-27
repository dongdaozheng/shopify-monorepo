import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'storefront/index': 'src/storefront/index.ts',
    'storefront/types': 'types/storefront/storefront.generated.d.ts',
    'admin/index': 'src/admin/index.ts',
    'admin/types': 'types/admin/admin.generated.d.ts'
  },
  format: ['esm'],
  dts: {
    resolve: true
  },
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  outDir: 'dist'
});
