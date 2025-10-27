import { ApiType, shopifyApiProject } from '@shopify/api-codegen-preset';
import type { IGraphQLConfig } from 'graphql-config';

export default {
  projects: {
    storefront: shopifyApiProject({
      apiType: ApiType.Storefront,
      documents: ['./src/storefront/**/*.{ts,tsx,js,jsx}'],
      outputDir: './types/storefront',
      apiVersion: '2025-07',
      declarations: true
    }),
    admin: shopifyApiProject({
      apiType: ApiType.Admin,
      documents: ['./src/admin/**/*.{ts,tsx,js,jsx}'],
      outputDir: './types/admin',
      declarations: true,
      apiVersion: '2025-07'
    })
  }
} as IGraphQLConfig;
