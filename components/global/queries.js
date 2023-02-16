import { gql } from "@apollo/client";
import * as fragments from "./fragments";

const shopifyLocale = Shopify.locale.toUpperCase();
const shopifyCountry = Shopify.country.toUpperCase();
const context = `@inContext(country: ${shopifyCountry}, language: ${shopifyLocale})`;

export const GET_PRODUCTS_BY_HANDLE = (handles) => gql`
  query products ($handle: String!) ${context} {
    products {
      ${handles
        .map(
          (handle, i) => `
          p${i}: productByHandle(handle: "${handle}") {
            ${fragments.product}
          }
        `,
        )
        .join('')}
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = gql`
  query product ($handle: String!) ${context} {
    product(handle: $handle) {
      ${fragments.product}
    }
  }
`;

export const GET_PRODUCTS = gql`
  query products ${context} {
    products(first: 250) {
      edges {
        node {
          ... on Product {
            ${fragments.product}
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_TAGS = (tags) => gql`
  query products ${context} {
    ${tags
      .map(
        (tag, i) => `
              p${i}: products(query: "tag:'${tag.replace(/"/g, '\\\"')}'", first: 25) {
                nodes {
                  ... on Product {
                  ${fragments.product}
                  }
                }
              }
            `,
      )
      .join('')}
  }
`;

export const GET_PRODUCTS_BY_IDS = () => gql`
query productsByIds ($ids: [ID!]!) ${context} {
    nodes(ids: $ids) {
      ... on Product {
        ${fragments.product}
      }
    }
  }
`;

export const GET_SIMILAR_PRODUCTS = gql`
query getSimilarProducts ($tag: String!) ${context} {
    products(query: $tag, first: 50) {
      edges {
        node {
          ${fragments.product}
        }
      }
    }
  }
`;

export const GET_PAGE_BY_HANDLE = gql`
query getPageByHandle ($handle: String!) ${context}{
    page(handle: $handle) {
      ${fragments.page}
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = gql`
  query collectionByHandle($handle: String!) ${context} {
      collection(handle: $handle) {
        products(first: 100) {
          edges {
            node {
              ... on Product {
            ${fragments.product}
            }
          }
        }
      }
    }
  }
`;
