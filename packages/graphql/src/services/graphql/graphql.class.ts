import { Injectable } from '@pequehq/di';
import { ApolloServer, gql } from 'apollo-server-express';
import { Application } from 'express';
import * as fs from 'fs';

import { ResolverService } from '../resolver/resolver.service';

@Injectable()
export class GraphQL {
  constructor(private resolverService: ResolverService) {}

  async apply(app: Application, schemaPath: string, path: string): Promise<void> {
    const schema = fs.readFileSync(schemaPath, { encoding: 'utf8' });
    const typeDefs = gql(schema);

    const resolvers = this.resolverService.loadResolvers();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();
    server.applyMiddleware({ app, path });
  }
}
