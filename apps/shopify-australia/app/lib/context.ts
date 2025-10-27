import { CART_QUERY_FRAGMENT } from '@repo/graphql/storefront';
import { getLocaleFromPath } from '@repo/i18n';
import { AppSession } from '@repo/lib';
import { createAxiosInstance, type ExtendedAxiosInstance } from '@repo/lib/axios';
import { createHydrogenContext } from '@shopify/hydrogen';
// import { createAdminClient } from './admin';

const getOrCreateHttpInstance = (() => {
  let serverHttpInstance: ExtendedAxiosInstance | null = null;

  return (env: Env): ExtendedAxiosInstance => {
    if (!serverHttpInstance) {
      if (!env.API_BASE_URL) {
        throw new Error('API_BASE_URL environment variable is required');
      }

      serverHttpInstance = createAxiosInstance({
        baseURL: env.API_BASE_URL,
        timeout: 30000
      });
    }

    return serverHttpInstance;
  };
})();

const createAdditionalContext = (env: Env, cache: Cache, waitUntil: ExecutionContext['waitUntil']) =>
  ({
    // admin: createAdminClient({ env, cache, waitUntil }),
    http: getOrCreateHttpInstance(env)
  }) as const;

type AdditionalContextType = ReturnType<typeof createAdditionalContext>;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

export async function createHydrogenRouterContext(request: Request, env: Env, executionContext: ExecutionContext) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([caches.open('hydrogen'), AppSession.init(request, [env.SESSION_SECRET])]);

  const additionalContext = createAdditionalContext(env, cache, waitUntil);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromPath(request),
      cart: {
        queryFragment: CART_QUERY_FRAGMENT
      },
      storefront: {
        apiVersion: '2025-07'
      }
    },
    additionalContext
  );

  return hydrogenContext;
}
