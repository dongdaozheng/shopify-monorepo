import { getLanguageFromWindow, initI18nClient } from '@repo/i18n';
import { NonceProvider } from '@shopify/hydrogen';
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { HydratedRouter } from 'react-router/dom';

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    const existingNonce = document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce;
    const language = getLanguageFromWindow();
    const i18n = initI18nClient(language);

    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18n}>
          <NonceProvider value={existingNonce}>
            <HydratedRouter />
          </NonceProvider>
        </I18nextProvider>
      </StrictMode>
    );
  });
}
