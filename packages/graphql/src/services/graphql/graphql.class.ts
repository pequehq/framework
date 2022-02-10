import { IResolvers, TypeSource } from '@graphql-tools/utils/Interfaces';
import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';
import { GraphQLSchema } from 'graphql';

export class GraphQL {
  async apply(
    schema: GraphQLSchema,
    resolvers: IResolvers | IResolvers[],
    app: Application,
    path: string,
    typeDefs: TypeSource,
  ): Promise<void> {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();
    server.applyMiddleware({ app, path });
  }
}
