import { buildLocalePath } from '@repo/i18n';
import { Link, useParams, type LinkProps } from 'react-router';

export interface LanguageSwitcherLinkProps extends Omit<LinkProps, 'to'> {
  locale: string;
  to?: string;
}
export function LanguageSwitcherLink({ locale, to = '/', ...props }: LanguageSwitcherLinkProps) {
  const localizedPath = buildLocalePath(locale, to);

  return <Link to={localizedPath} {...props} />;
}

export interface LanguageSwitcherProps {
  languages: Array<{
    code: string;
    label: string;
    flag?: string;
  }>;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  navigateTo?: string;
}

export function LanguageSwitcher({
  languages,
  className = 'flex gap-4',
  activeClassName = 'bg-blue-600',
  inactiveClassName = 'bg-gray-600',
  navigateTo = '/'
}: LanguageSwitcherProps) {
  const params = useParams();
  const currentLocale = params.locale || 'en';

  return (
    <div className={className}>
      {languages.map(lang => (
        <LanguageSwitcherLink
          key={lang.code}
          locale={lang.code}
          to={navigateTo}
          className={`px-4 py-2 text-white no-underline rounded ${
            currentLocale === lang.code ? activeClassName : inactiveClassName
          }`}
        >
          {lang.flag && `${lang.flag} `}
          {lang.label}
        </LanguageSwitcherLink>
      ))}
    </div>
  );
}
