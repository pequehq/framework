import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';

import { GraphqlFactory } from '../src/graphql.factory';

export async function createGraphQL(schemaPaths: string[]): Promise<ApolloServer> {
  const graphQLFactory = new GraphqlFactory();
  const graphQL = graphQLFactory.createServer();

  const resolvers = graphQL.getResolversClassDeclaration().map((resolver) => new resolver());

  const app = express();
  const server = createServer();

  return await graphQL.config({ app, path: './graphql', resolvers, schemaPaths, server });
}
