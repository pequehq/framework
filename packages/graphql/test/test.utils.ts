import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';

import { ResolverDeclaration } from '../src/interfaces';

interface Config {
  schemaPaths: string[];
  resolvers: InstanceType<ResolverDeclaration>[];
}

export function createGraphQLServer(config: Config): ApolloServer {
  const typeDefs: string[] = [];
  for (const schemaPath of config.schemaPaths) {
    const schemaFile = fs.readFileSync(schemaPath, { encoding: 'utf8' });
    typeDefs.push(schemaFile);
  }
  const mergedTypeDefs = mergeTypeDefs(typeDefs);

  return new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergeResolvers(config.resolvers),
  });
}
