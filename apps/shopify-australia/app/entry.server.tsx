import { getLanguageFromPath, initI18nServer } from '@repo/i18n';
import { createContentSecurityPolicy, type HydrogenRouterContextProvider } from '@shopify/hydrogen';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN
    }
  });

  const language = getLanguageFromPath(request);
  const i18n = initI18nServer(language);

  const body = await renderToReadableStream(
    <I18nextProvider i18n={i18n}>
      <NonceProvider>
        <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
      </NonceProvider>
    </I18nextProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
