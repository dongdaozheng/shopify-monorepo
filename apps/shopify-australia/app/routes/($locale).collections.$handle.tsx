import { PaginatedResourceSection, ProductItem } from '@repo/components';
import { COLLECTION_QUERY } from '@repo/graphql/storefront';
import type { ProductItemFragment } from '@repo/graphql/storefront/types';
import { redirectIfHandleIsLocalized } from '@repo/lib';
import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/($locale).collections.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.collection.title ?? ''} Collection` }];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);

  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{ collection }] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle, ...paginationVariables }
    })
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404
    });
  }

  redirectIfHandleIsLocalized(request, { handle, data: collection });

  return {
    collection
  };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <PaginatedResourceSection<ProductItemFragment>
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({ node: product, index }) => (
          <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle
          }
        }}
      />
    </div>
  );
}
