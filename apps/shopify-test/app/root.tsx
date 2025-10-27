import { PageLayout } from '@repo/components';
import { FOOTER_QUERY, HEADER_QUERY } from '@repo/graphql/storefront';
import type { CartApiQueryFragment } from '@repo/graphql/storefront/types';
import { getLanguageFromWindow } from '@repo/i18n';
import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useParams,
  useRouteError,
  useRouteLoaderData,
  type ShouldRevalidateFunction
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import appStyles from '~/styles/app.scss?url';
import resetStyles from '~/styles/reset.scss?url';
import type { Route } from './+types/root';
import tailwindCss from './styles/tailwind.css?url';

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  if (formMethod && formMethod !== 'GET') return true;

  if (currentUrl.toString() === nextUrl.toString()) return true;

  return false;
};

export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com'
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app'
    },
    { rel: 'icon', type: 'image/svg+xml', href: favicon }
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);

  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    apiBaseUrl: env.API_BASE_URL, // 传递 API_BASE_URL 到客户端
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language
    }
  };
}

async function loadCriticalData({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu'
      }
    })
  ]);

  return { header };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  const { storefront, customerAccount, cart } = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer'
      }
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer
  };
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  const params = useParams();
  const { i18n } = useTranslation();

  // 监听路由变化，同步更新 i18n 语言
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentLanguage = getLanguageFromWindow();
      if (i18n.language !== currentLanguage) {
        void i18n.changeLanguage(currentLanguage);
      }
    }
  }, [params.locale, i18n]);

  // 将 API_BASE_URL 存储到 localStorage
  useEffect(() => {
    if (data?.apiBaseUrl && typeof window !== 'undefined') {
      localStorage.setItem('API_BASE_URL', data.apiBaseUrl);
    }
  }, [data?.apiBaseUrl]);

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <PageLayout {...data} cart={data.cart as Promise<CartApiQueryFragment | null>}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
