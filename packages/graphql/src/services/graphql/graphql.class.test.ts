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

test.run();
