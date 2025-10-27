import { SearchForm, SearchResults } from '@repo/components';
import { PREDICTIVE_SEARCH_QUERY, SEARCH_QUERY } from '@repo/graphql/storefront';
import type { PredictiveSearchQuery, RegularSearchQuery } from '@repo/graphql/storefront/types';
import { type PredictiveSearchReturn, type RegularSearchReturn, getEmptyPredictiveSearchResult } from '@repo/lib';
import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/($locale).search';

export const meta: Route.MetaFunction = () => {
  return [{ title: `Hydrogen | Search` }];
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise: Promise<PredictiveSearchReturn | RegularSearchReturn> = isPredictive
    ? predictiveSearch({ request, context })
    : regularSearch({ request, context });

  searchPromise.catch((error: Error) => {
    console.error(error);
    return { term: '', result: null, error: error.message };
  });

  return await searchPromise;
}

export default function SearchPage() {
  const { type, term, result, error } = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <div className="search">
      <h1>Search</h1>
      <SearchForm>
        {({ inputRef }) => (
          <>
            <input defaultValue={term} name="q" placeholder="Search…" ref={inputRef} type="search" />
            &nbsp;
            <button type="submit">Search</button>
          </>
        )}
      </SearchForm>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!term || !result?.total ? (
        <SearchResults.Empty />
      ) : (
        <SearchResults result={result} term={term}>
          {({ articles, pages, products, term }) => (
            <div>
              <SearchResults.Products products={products} term={term} />
              <SearchResults.Pages pages={pages} term={term} />
              <SearchResults.Articles articles={articles} term={term} />
            </div>
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{ searchTerm: term, searchResults: result }} />
    </div>
  );
}

async function regularSearch({
  request,
  context
}: Pick<Route.LoaderArgs, 'request' | 'context'>): Promise<RegularSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, { pageBy: 8 });
  const term = String(url.searchParams.get('q') || '');

  const { errors, ...items }: { errors?: Array<{ message: string }> } & RegularSearchQuery = await storefront.query(
    SEARCH_QUERY,
    {
      variables: { ...variables, term }
    }
  );

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, { nodes }: { nodes: Array<unknown> }) => acc + nodes.length,
    0
  );

  const error = errors ? errors.map(({ message }: { message: string }) => message).join(', ') : undefined;

  return { type: 'regular', term, error, result: { total, items } };
}

async function predictiveSearch({
  request,
  context
}: Pick<Route.ActionArgs, 'request' | 'context'>): Promise<PredictiveSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return { type, term, result: getEmptyPredictiveSearchResult() };

  const { predictiveSearch: items, errors }: PredictiveSearchQuery & { errors?: Array<{ message: string }> } =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: {
        limit,
        limitScope: 'EACH',
        term
      }
    });

  if (errors) {
    throw new Error(`Shopify API errors: ${errors.map(({ message }: { message: string }) => message).join(', ')}`);
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce((acc: number, item: Array<unknown>) => acc + item.length, 0);

  return { type, term, result: { items, total } };
}
