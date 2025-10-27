import type { I18nBase } from '@shopify/hydrogen';
import type { SupportedLanguage } from '..';

export interface MarketConfig {
  country: string;
  currency: string;
}

const LANGUAGE_CONFIG: Record<
  SupportedLanguage,
  {
    language: I18nBase['language'];
    pathPrefix: string;
    defaultCountry: I18nBase['country'];
  }
> = {
  EN: { language: 'EN', pathPrefix: 'en', defaultCountry: 'US' },
  DE: { language: 'DE', pathPrefix: 'de', defaultCountry: 'DE' },
  AU: { language: 'EN', pathPrefix: 'au', defaultCountry: 'AU' }
} as const;

const PATH_PREFIX_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  en: 'EN',
  de: 'DE',
  au: 'AU'
} as const;

const DEFAULT_LANGUAGE: SupportedLanguage = 'EN';

export function getLocaleFromPath(request: Request, country?: string): I18nBase {
  const languageKey = getLanguageFromPath(request);
  const config = LANGUAGE_CONFIG[languageKey];

  return {
    language: config.language,
    country: country || config.defaultCountry,
    pathPrefix: languageKey === 'EN' ? '' : config.pathPrefix
  } as I18nBase;
}

export function getLanguageFromPath(request: Request): SupportedLanguage {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0].toLowerCase();
    const language = PATH_PREFIX_TO_LANGUAGE[firstSegment];
    if (language) {
      return language;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function getLanguageFromWindow(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const pathSegments = window.location.pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0].toLowerCase();
    const language = PATH_PREFIX_TO_LANGUAGE[firstSegment];
    if (language) {
      return language;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function getLanguageCode(language: SupportedLanguage): string {
  return LANGUAGE_CONFIG[language].pathPrefix;
}

export function buildLocalePath(language: string, path: string = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const languageCode =
    language.length === 2
      ? language.toLowerCase()
      : LANGUAGE_CONFIG[language.toUpperCase() as SupportedLanguage].pathPrefix;

  if (languageCode === 'en' || language.toUpperCase() === 'EN') {
    return normalizedPath === '/' ? '/' : normalizedPath;
  }

  if (normalizedPath === '/') {
    return `/${languageCode}`;
  }

  return `/${languageCode}${normalizedPath}`;
}
