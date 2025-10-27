import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { SupportedLanguage, TranslationKeys } from '../index';

export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (language: SupportedLanguage): Promise<any> => {
    return i18n.changeLanguage(language);
  };

  return {
    t: t as (key: TranslationKeys, options?: any) => string,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language as SupportedLanguage
  };
}
