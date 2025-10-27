import i18next, { type i18n as I18nInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import au from './AU/translate.json';
import de from './DE/translate.json';
import en from './EN/translate.json';

const resources = {
  AU: { translation: au },
  DE: { translation: de },
  EN: { translation: en }
} as const;

export const supportedLanguages = Object.keys(resources) as Array<keyof typeof resources>;

export type SupportedLanguage = keyof typeof resources;

export type TranslationKeys = keyof typeof en;

export const i18n: I18nInstance = i18next.createInstance();

const i18nConfig = {
  resources,
  supportedLngs: supportedLanguages,
  fallbackLng: 'EN',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false
  }
};

export function initI18nServer(language: SupportedLanguage) {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      ...i18nConfig,
      lng: language
    });
  } else {
    i18n.changeLanguage(language);
  }
  return i18n;
}

export function initI18nClient(initialLanguage?: SupportedLanguage) {
  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        ...i18nConfig,
        lng: initialLanguage,
        detection: {
          order: ['htmlTag', 'querystring', 'cookie', 'localStorage', 'navigator'],
          caches: ['localStorage', 'cookie'],
          htmlTag: document.documentElement
        }
      });
  }
  return i18n;
}

export * from './lib/hooks';
export * from './lib/i18n';

export default i18n;
