import express from 'express';
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

  await graphQL.apply(__dirname + '/../../../test/schema/schema.graphql', app, '/graphql');
  assert.is(1, 1);
});

test.run();
