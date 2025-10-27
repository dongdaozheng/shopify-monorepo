import type { ProductFragment } from '@repo/graphql/storefront/types';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { Link, useNavigate } from 'react-router';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';

export function ProductForm({
  productOptions,
  selectedVariant
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  return (
    <div className="product-form">
      {productOptions.map(option => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map(value => {
                const { name, handle, variantUriQuery, selected, available, exists, isDifferentProduct, swatch } =
                  value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`product-options-item${selected ? ' selected' : ''}${!available ? ' unavailable' : ''}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`product-options-item${exists && !selected ? ' link' : ''}${selected ? ' selected' : ''}${!available ? ' unavailable' : ''}`}
                      key={option.name + name}
                      aria-label={name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant
                }
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({ swatch, name }: { swatch?: Maybe<ProductOptionValueSwatch> | undefined; name: string }) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div aria-label={name} className="product-option-label-swatch" {...(color && { 'data-color': color })}>
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
