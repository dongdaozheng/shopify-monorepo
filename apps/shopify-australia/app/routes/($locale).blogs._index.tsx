import { PaginatedResourceSection } from '@repo/components';
import { BLOGS_QUERY } from '@repo/graphql/storefront';
import type { BlogsQuery } from '@repo/graphql/storefront/types';
import { getPaginationVariables } from '@shopify/hydrogen';
import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/($locale).blogs._index';

type BlogNode = BlogsQuery['blogs']['nodes'][0];

export const meta: Route.MetaFunction = () => {
  return [{ title: `Hydrogen | Blogs` }];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);

  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, request }: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10
  });

  const [{ blogs }] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables
      }
    })
  ]);

  return { blogs };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Blogs() {
  const { blogs } = useLoaderData<typeof loader>();

  return (
    <div className="blogs">
      <h1>Blogs</h1>
      <div className="blogs-grid">
        <PaginatedResourceSection<BlogNode> connection={blogs}>
          {({ node: blog }: { node: BlogNode }) => (
            <Link className="blog" key={blog.handle} prefetch="intent" to={`/blogs/${blog.handle}`}>
              <h2>{blog.title}</h2>
            </Link>
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}
