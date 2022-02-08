import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { IResolvers } from '@graphql-tools/utils';
import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';
import { makeExecutableSchema } from 'graphql-tools';

export class GraphQL {
  async apply(schemaPath: string, resolvers: IResolvers | IResolvers[], app: Application, path: string): Promise<void> {
    const typeDefs = loadSchemaSync(schemaPath, { loaders: [new GraphQLFileLoader()] });
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });
    const server = new ApolloServer({
      schema,
    });

    await server.start();
    server.applyMiddleware({ app, path });
  }
}
