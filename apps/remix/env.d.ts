/// <reference types="vite/client" />

import type { AppLoadContext as ServerAppLoadContext } from './server';

declare module 'react-router' {
  interface AppLoadContext extends ServerAppLoadContext {}
}
