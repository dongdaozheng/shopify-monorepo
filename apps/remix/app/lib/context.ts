export interface AppLoadContext extends Record<string, unknown> {
  env: {
    NODE_ENV: string;
  };
}
