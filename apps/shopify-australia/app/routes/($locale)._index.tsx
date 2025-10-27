import { Card } from '@repo/components';
import { useTranslation } from '@repo/i18n';
import type { Route } from './+types/($locale)._index';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export const loader = async ({ context: { http } }: Route.LoaderArgs) => {
  return null;
};

export default function Homepage() {
  // const { products } = useLoaderData<typeof loader>();
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="home">
      <Card>
        <p>Homepage</p>
      </Card>
    </div>
  );
}
