import { buildLocalePath } from '@repo/i18n';
import { Link, useParams, type LinkProps } from 'react-router';

export interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  absolute?: boolean;
}

export function LocalizedLink({ to, absolute = false, ...props }: LocalizedLinkProps) {
  const params = useParams();
  if (absolute) return <Link to={to} {...props} />;
  const currentLocale = params.locale || 'en';
  const localizedPath = buildLocalePath(currentLocale, to);

  return <Link to={localizedPath} {...props} />;
}
