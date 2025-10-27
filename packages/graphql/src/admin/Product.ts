export const PRODUCT_QUERY = `#graphql
  query Product($id: ID!) {
    product(id: $id) {
      id
    }
  }
` as const;

export const BUNDLE_COMPONENTS_QUERY = `#graphql
query BundleComponents($id: ID!) {
  product(id: $id) {
    handle
    title
    shortTitleMetafield: metafield(key: "short_title", namespace: "custom") {
      value
      id
    }
    featuredImage {
      url
      altText
    }
    labelMetafield: metafield(key: "label", namespace: "custom") {
      value
      id
    }
    variants(first: 100) {
      nodes {
        position
        availableForSale
        id
        title
        sku
        price
        compareAtPrice
        product {
          title
          handle
          description
          id
          featuredImage {
            url
            altText
          }
        }
        image {
          url
          altText
        }
        labelMetafield: metafield(key: "label", namespace: "custom") {
          value
          id
        }
        giftMetafield: metafield(key: "gift", namespace: "custom") {
          value
          id
        }
        productVariantComponents(first: 20) {
          nodes {
            productVariant {
              id
              position
            }
          }
        }
      }
    }
    bundleComponents(first: 100) {
      nodes {
        optionSelections {
          values {
            selectionStatus
            value
          }
        }
        componentVariants(first: 100) {
          nodes {
            id
            title
            image {
              url
              altText
            }
            availableForSale
            product {
              title
              description
              featuredImage {
                url
                altText
              }
            }
            price
            compareAtPrice
          }
        }
        componentProduct {
          title
          id
          featuredImage {
            url
            altText
          }
          shortTitleMetafield: metafield(key: "short_title", namespace: "custom") {
            value
            id
          }
        }
        quantity
      }
    }
  }
}` as const;
