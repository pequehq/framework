import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';

export class GraphQL {
  async apply(schema: string, app: Application, path: string): Promise<void> {
    const gqlSchema = loadSchemaSync(schema, { loaders: [new GraphQLFileLoader()] });
    const server = new ApolloServer({
      schema: gqlSchema,
    });

    await server.start();
    server.applyMiddleware({ app, path });
  }
}
