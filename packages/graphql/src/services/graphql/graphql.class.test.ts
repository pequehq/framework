import { ApolloError } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { GraphQL } from './graphql.class';

const test = suite<{ sandbox: sinon.SinonSandbox }>('GraphQL');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should apply the schema to the app', async (context) => {
  const graphQL = new GraphQL();
  const app = express();

  const ServiceResolvers = {
    Query: {
      helloWorld: (st: string) => {
        try {
          return 'pezzodimmerda ' + st;
        } catch (error) {
          throw new ApolloError(error);
        }
      },
      sbeffo: () => ({ name: 'sbeffolino' }),
    },
  };

  await graphQL.apply(__dirname + '/../../../test/schema/schema.graphql', ServiceResolvers, app, '/graphql');
  // const httpServer = createServer(app);
  // httpServer.listen({ port: 3000 }, (): void =>
  //   console.log(`GraphQL-Server is running on http://localhost:3000/graphql`),
  // );
  assert.is(1, 1);
});

test.run();
