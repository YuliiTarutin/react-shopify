export const product = `
  id
  tags
  title
  handle
  vendor
  description
  available: availableForSale
  images(first: 2) {
    edges {
      node {
        src
        srcSwatch: url(transform: { maxHeight: 92, maxWidth: 92 })
        altText
        height
        width
      }
    }
  }
  media(first: 20) {
    edges {
      node {
        alt
        mediaContentType
        ... on MediaImage {
          alt
          id
          image {
            url
            id
            altText
          }
        }
        ... on Video {
          previewImage {
            id
            url
          }
          sources {
            url
            format
          }
        }
        ... on ExternalVideo {
          id
          host
          originUrl
        }
      }
    }
  }
  onlineStoreUrl
  priceRange {
    minVariantPrice {
      amount
    }
    maxVariantPrice {
      amount
    }
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
    }
    maxVariantPrice {
      amount
    }
  }
  options {
    name
    values
  }
  variants(first: 50) {
    edges {
      node {
        id
        title
        sku
        availableForSale
        barcode
        selectedOptions {
          name
          value
        }
        priceV2 {
          amount
        }
        compareAtPriceV2 {
          amount
        }
        image {
          src
          altText
          height
          width
        }
      }
    }
  }
`;

export const page = `
  title
  body
  bodySummary
`;
