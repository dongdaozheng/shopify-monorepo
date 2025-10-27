import { redirect } from 'react-router';
import type { Route } from './+types/($locale).cart.$lines';

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { cart } = context;
  const { lines } = params;
  if (!lines) return redirect('/cart');
  const linesMap = lines.split(',').map(line => {
    const lineDetails = line.split(':');
    const variantId = lineDetails[0];
    const quantity = parseInt(lineDetails[1], 10);

    return {
      merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
      quantity
    };
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];

  const result = await cart.create({
    lines: linesMap,
    discountCodes: discountArray
  });

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {
      status: 410
    });
  }

  const headers = cart.setCartId(cartResult.id);

  if (cartResult.checkoutUrl) {
    return redirect(cartResult.checkoutUrl, { headers });
  } else {
    throw new Error('No checkout URL found');
  }
}

export default function Component() {
  return null;
}
