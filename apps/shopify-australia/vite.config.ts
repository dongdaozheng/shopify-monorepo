import { reactRouter } from '@react-router/dev/vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), hydrogen(), oxygen(), reactRouter(), tsconfigPaths()],
  build: {
    assetsInlineLimit: 0,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'es2020'
  },
  optimizeDeps: {
    exclude: ['@repo/components', '@repo/lib'],
    include: ['react', 'react-dom', 'react-router', 'i18next', 'react-i18next']
  },
  ssr: {
    optimizeDeps: {
      include: [
        'set-cookie-parser',
        'cookie',
        'react-router',
        'react-dom/server',
        'i18next',
        'react-i18next',
        'i18next-browser-languagedetector'
      ]
    },
    noExternal: ['react-dom', /^@repo\//, 'react-i18next', 'i18next', 'i18next-browser-languagedetector']
  },
  css: {
    preprocessorOptions: {},
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['defaults', 'not ie < 11', 'last 2 versions', '> 1%', 'iOS 7', 'last 3 iOS versions']
        }),
        cssnano({
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true
            }
          ]
        })
      ]
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app')
    }
  },
  server: {
    port: 3000,
    allowedHosts: ['.tryhydrogen.dev']
  }
});
