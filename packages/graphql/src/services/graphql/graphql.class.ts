import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { Injectable } from '@pequehq/di';
import { ApolloServer, gql } from 'apollo-server-express';
import { Application } from 'express';
import * as fs from 'fs';
import { DocumentNode } from 'graphql';

import { ResolverService } from '../resolver/resolver.service';

@Injectable()
export class GraphQL {
  constructor(private resolverService: ResolverService) {}

  async apply(app: Application, schemaPaths: string[], path: string): Promise<void> {
    const typeDefs: DocumentNode[] = [];

    for (const schemaPath of schemaPaths) {
      const schemaFile = fs.readFileSync(schemaPath, { encoding: 'utf8' });
      typeDefs.push(gql(schemaFile));
    }

    const resolvers = this.resolverService.loadResolvers();

    const server = new ApolloServer({
      typeDefs: mergeTypeDefs(typeDefs),
      resolvers: mergeResolvers(resolvers),
    });

    await server.start();
    server.applyMiddleware({ app, path });
  }
}
