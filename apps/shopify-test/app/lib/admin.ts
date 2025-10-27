import { ApiVersion, Session, shopifyApi } from '@shopify/shopify-api';
import '@shopify/shopify-api/adapters/web-api';

export function createAdminClient({
  env,
  cache,
  waitUntil
}: {
  env: Env;
  cache: Cache;
  waitUntil: ExecutionContext['waitUntil'];
}) {
  if (!env.PRIVATE_ADMIN_TOKEN) {
    throw new Error('PRIVATE_ADMIN_TOKEN environment variable is required');
  }

  if (!env.PUBLIC_STORE_DOMAIN) {
    throw new Error('PUBLIC_STORE_DOMAIN environment variable is required');
  }

  const shopify = shopifyApi({
    apiKey: 'not-needed-for-custom-app',
    apiSecretKey: 'not-needed-for-custom-app',
    scopes: [],
    hostName: env.PUBLIC_STORE_DOMAIN,
    apiVersion: ApiVersion.July25,
    isCustomStoreApp: true,
    isEmbeddedApp: false,
    adminApiAccessToken: env.PRIVATE_ADMIN_TOKEN,
    future: {
      customerAddressDefaultFix: true,
      unstable_managedPricingSupport: true
    }
  });

  const session = new Session({
    id: `offline_${env.PUBLIC_STORE_DOMAIN}`,
    shop: env.PUBLIC_STORE_DOMAIN,
    state: 'offline',
    isOnline: false,
    accessToken: env.PRIVATE_ADMIN_TOKEN
  });

  const client = new shopify.clients.Graphql({ session });

  return {
    query: async <T = any>(query: string, variables?: Record<string, any>, ttl: number = 60) => {
      if (cache) {
        const cacheKey = `admin:${query.substring(0, 10)}:${JSON.stringify(variables || {})}`;
        const cacheUrl = new Request(`https://${env.PUBLIC_STORE_DOMAIN}/${cacheKey}`);

        const cachedResponse = await cache.match(cacheUrl);
        if (cachedResponse) {
          const data = await cachedResponse.json();
          return data as T;
        }

        console.log('cache miss');

        const response = await client.request<T>(query, { variables });

        // 使用 waitUntil 确保缓存写入完成，但不阻塞响应
        const cacheResponse = new Response(JSON.stringify(response.data), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `max-age=${ttl}`
          }
        });

        waitUntil?.(cache.put(cacheUrl, cacheResponse));

        return response.data;
      }

      const response = await client.request<T>(query, { variables });
      return response.data;
    },

    mutate: async <T = any>(mutation: string, variables?: Record<string, any>) => {
      const response = await client.request<T>(mutation, { variables });
      return response.data;
    },
    raw: client,
    rest: new shopify.clients.Rest({ session })
  };
}

export type AdminClient = ReturnType<typeof createAdminClient>;
