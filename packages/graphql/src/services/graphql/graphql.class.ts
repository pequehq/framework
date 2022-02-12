import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { mergeSchemas } from '@graphql-tools/schema';
import { Injectable } from '@pequehq/di';
import { ApolloServer, gql } from 'apollo-server-express';
import { Application } from 'express';
import * as fs from 'fs';
import { DocumentNode, execute, subscribe } from 'graphql';
import { Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { ResolverDeclaration } from '../../interfaces';
import { ResolverService } from '../resolver/resolver.service';
import { ResolverStorage } from '../resolver-storage/resolver-storage.service';

interface Config {
  app: Application;
  server: Server;
  schemaPaths: string[];
  path: string;
  resolvers: InstanceType<ResolverDeclaration>[];
}

@Injectable()
export class GraphQL {
  constructor(private resolverService: ResolverService) {}

  getResolversClassDeclaration(): ResolverDeclaration[] {
    return ResolverStorage.getAll();
  }

  async config(config: Config): Promise<ApolloServer> {
    const typeDefs: DocumentNode[] = [];
    for (const schemaPath of config.schemaPaths) {
      const schemaFile = fs.readFileSync(schemaPath, { encoding: 'utf8' });
      typeDefs.push(gql(schemaFile));
    }
    const mergedTypeDefs = mergeTypeDefs(typeDefs);
    const schema = mergeSchemas({ typeDefs: mergedTypeDefs });

    const apolloResolvers = this.resolverService.loadResolvers(config.resolvers);

    const subscriptionServer = SubscriptionServer.create(
      { schema, execute, subscribe },
      { server: config.server, path: config.path },
    );

    const server = new ApolloServer({
      typeDefs: mergedTypeDefs,
      resolvers: mergeResolvers(apolloResolvers),
      plugins: [
        {
          async serverWillStart(): Promise<{ drainServer(): Promise<void> }> {
            return {
              async drainServer(): Promise<void> {
                subscriptionServer.close();
              },
            };
          },
        },
      ],
    });

    await server.start();
    server.applyMiddleware({ app: config.app, path: config.path });

    return server;
  }
}
