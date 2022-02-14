import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { ApolloServer, gql } from 'apollo-server-express';
import fs from 'fs';
import { DocumentNode } from 'graphql';

import { ResolverDeclaration } from '../src/interfaces';

interface Config {
  schemaPaths: string[];
  resolvers: InstanceType<ResolverDeclaration>[];
}

export function createGraphQLServer(config: Config): ApolloServer {
  const typeDefs: DocumentNode[] = [];
  for (const schemaPath of config.schemaPaths) {
    const schemaFile = fs.readFileSync(schemaPath, { encoding: 'utf8' });
    typeDefs.push(gql(schemaFile));
  }
  const mergedTypeDefs = mergeTypeDefs(typeDefs);

  return new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergeResolvers(config.resolvers),
  });
}
