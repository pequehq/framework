import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Query, Resolver } from '../../decorators';
import { GraphqlFactory } from '../../graphql.factory';
import { ResolverStorage } from '../resolver-storage/resolver-storage.service';

const test = suite('GraphQL');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    apolloServerStart: context.sandbox.spy(ApolloServer.prototype, 'start'),
    apolloServerApplyMiddleware: context.sandbox.spy(ApolloServer.prototype, 'applyMiddleware'),
  };
});

test.after.each((context) => {
  context.sandbox.restore();
  ResolverStorage.clear();
});

test('should load all resolvers and typeDefs', async (context) => {
  @Resolver()
  class ResolverOne {
    @Query()
    testOne(): void {
      // noop.
    }
  }

  @Resolver()
  class ResolverTwo {
    @Query()
    testTwo(): void {
      // noop.
    }
  }

  const graphQLFactory = new GraphqlFactory();
  const graphQL = graphQLFactory.createServer();

  const schemaPaths = [`${__dirname}/../../../test/schema/graphql.service.graphql`];
  const resolvers = graphQL.getResolversClassDeclaration().map((resolver) => new resolver());

  const app = express();
  const server = createServer();

  const apolloServer = await graphQL.config({ app, path: './graphql', resolvers, schemaPaths, server });

  assert.instance(apolloServer, ApolloServer);
  assert.ok(context.spies.apolloServerStart.calledOnce);
  assert.ok(context.spies.apolloServerApplyMiddleware.calledOnce);
  assert.ok(context.spies.apolloServerApplyMiddleware.calledWith({ app, path: './graphql' }));
});

test.run();
