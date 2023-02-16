import {
  ApolloClient, createHttpLink, InMemoryCache
} from "@apollo/client";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: `/api/2022-10/graphql.json`
});
const middlewareLink = setContext(() => ({
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": 'e2b82cee0ac1ecb24c025f175bd5236d',
  },
}));

const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
