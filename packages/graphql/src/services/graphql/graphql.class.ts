import { IResolvers } from '@graphql-tools/utils/Interfaces';
import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';
import { GraphQLSchema } from 'graphql';

export class GraphQL {
  async apply(
    schema: GraphQLSchema,
    resolvers: IResolvers | IResolvers[],
    app: Application,
    path: string,
  ): Promise<void> {
    const server = new ApolloServer({
      schema,
      resolvers,
    });

    await server.start();
    server.applyMiddleware({ app, path });
  }
}
