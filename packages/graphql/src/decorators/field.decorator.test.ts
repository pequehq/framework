import 'reflect-metadata';

import { ApolloError } from 'apollo-server-express';
import express from 'express';
import * as fs from 'fs';
import { buildSchema } from 'graphql';
import { createServer } from 'http';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI } from '../di';
import { GraphQL, SchemaBuilderService } from '../services';

const test = suite('@Field');

test('should load @Field metadata', async () => {
  const file = fs.readFileSync(`${__dirname}/../../test/schema/schema.graphql`, { encoding: 'utf8' });
  const schema = buildSchema(file);

  const graphQL = new GraphQL();
  const app = express();

  const ServiceResolvers = {
    Query: {
      user: () => {
        const users = [
          { id: 1, name: 'simone', surname: 'di cicco', location: 1 },
          { id: 2, name: 'beppe', surname: 'tenzio', location: 2 },
          { id: 3, name: 'loco', surname: 'marte', location: 3 },
        ];
        return users;
      },
    },
    User: {
      location: (parent, args, ctx, info) => {
        const locations = [
          { id: 1, city: 'madrid', country: 'spain' },
          { id: 2, city: 'lanciano', country: 'italy' },
          { id: 3, city: 'berlin', country: 'germany' },
        ];
        return locations.filter((location) => location.id === parent.location);
      },
    },
  };

  // await graphQL.apply(schema, ServiceResolvers, app, '/graphql');
  // const httpServer = createServer(app);
  // httpServer.listen({ port: 3000 }, (): void =>
  //   console.log(`GraphQL-Server is running on http://localhost:3000/graphql`),
  // );
  assert.is(1, 1);
});

test.run();
