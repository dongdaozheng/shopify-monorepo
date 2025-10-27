/// <reference types="vite/client" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type { HydrogenEnv, HydrogenRouterContextProvider } from '@shopify/hydrogen';

declare module 'react-router' {
  interface RouterContextProvider extends HydrogenRouterContextProvider {}
  interface AppLoadContext extends HydrogenRouterContextProvider {}
}

declare global {
  interface Env extends HydrogenEnv {
    PRIVATE_ADMIN_TOKEN?: string; // Admin API 访问令牌
    API_BASE_URL?: string; // 后端 API 地址
  }
}
