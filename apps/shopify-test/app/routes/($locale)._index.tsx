import { Card, LanguageSwitcher, LocalizedLink } from '@repo/components';
import { useTranslation } from '@repo/i18n';
import { useParams } from 'react-router';
import type { Route } from './+types/($locale)._index';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

// export const loader = async ({ context: { admin } }: Route.LoaderArgs) => {
//   const products = await admin.query<ProductQuery>(
//     BUNDLE_COMPONENTS_QUERY,
//     { id: 'gid://shopify/Product/9642095575338' },
//     60
//   );
//   return { products };
// };

export default function Homepage() {
  // const { products } = useLoaderData<typeof loader>();
  const { t, currentLanguage } = useTranslation();
  const params = useParams();
  const currentLocale = params.locale || 'en';

  return (
    <div className="home p-8">
      <Card>
        <h1 className="text-3xl font-bold mb-4">{t('welcome')}</h1>

        <div className="mb-8">
          <p className="mb-2">
            <strong>{t('current_language')}:</strong> {currentLanguage}
          </p>
          <p className="mb-2">
            <strong>URL Language Code:</strong> {currentLocale}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Market: <strong>US</strong> (固定) | Language: <strong>{currentLanguage}</strong> (可切换)
          </p>
        </div>

        <div className="mb-8">
          <p className="mb-2">{t('add_to_cart')}</p>
        </div>

        <LanguageSwitcher
          languages={[
            { code: 'en', label: t('switch_to_english'), flag: '🇺🇸' },
            { code: 'de', label: t('switch_to_german'), flag: '🇩🇪' },
            { code: 'au', label: 'Australian English', flag: '🇦🇺' }
          ]}
          activeClassName="bg-blue-600"
          inactiveClassName="bg-gray-600"
        />

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="mb-2 font-semibold">🔗 LocalizedLink Examples:</h3>
          <p className="text-sm text-gray-500 mb-3">
            These links automatically preserve your current language (无需传递 locale 参数)
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Navigate to products:</p>
              <LocalizedLink to="/products" className="text-blue-600 hover:underline">
                Products → {currentLocale === 'en' ? '/products' : `/${currentLocale}/products`}
              </LocalizedLink>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Navigate to cart:</p>
              <LocalizedLink to="/cart" className="text-blue-600 hover:underline">
                Cart → {currentLocale === 'en' ? '/cart' : `/${currentLocale}/cart`}
              </LocalizedLink>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Navigate to home:</p>
              <LocalizedLink to="/" className="text-blue-600 hover:underline">
                Home → {currentLocale === 'en' ? '/' : `/${currentLocale}`}
              </LocalizedLink>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="mb-2 font-semibold">ℹ️ URL Structure (Market-Fixed Architecture):</h3>
          <ul className="list-none p-0 space-y-1 text-sm">
            <li>
              ✅ English (default): <code>/products</code> - no prefix
            </li>
            <li>
              ✅ German: <code>/de/products</code> - with /de prefix
            </li>
            <li>
              ✅ Australian English: <code>/au/products</code> - with /au prefix
            </li>
            <li className="mt-2 pt-2 border-t border-blue-200">
              💡 <strong>Note:</strong> Market (US/AU) is configured per deployment, URL only changes with language
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
