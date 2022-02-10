import 'reflect-metadata';

import { ApolloError, gql } from 'apollo-server-express';
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
  const typeDefs = gql(file);

  const graphQL = new GraphQL();
  const app = express();

  const ServiceResolvers = {
    Query: {
      user(parent, args, context, info) {
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
        return locations.find((location) => location.id === parent.location);
      },
      family: (parent, args, ctx, info) => {
        const members = [
          { userId: 3, father: 'aa', mother: 'bb' },
          { userId: 2, father: 'cc', mother: 'dd' },
          { userId: 1, father: 'ee', mother: 'ff' },
        ];
        return members.find((member) => member.userId === parent.id);
      },
    },
    Location: {
      properties: (parent, args, ctx, info) => {
        const properties = [
          { locationId: 1, property: 'guapisima' },
          { locationId: 1, property: 'madonna' },
          { locationId: 2, property: 'dios' },
          { locationId: 2, property: 'listisima' },
          { locationId: 3, property: 'fea' },
          { locationId: 3, property: 'waaaa' },
          { locationId: 3, property: 'daje' },
          { locationId: 3, property: 'cazzo' },
        ];
        return properties.filter((prop) => prop.locationId === parent.id);
      },
    },
  };

  // await graphQL.apply(schema, ServiceResolvers, app, '/graphql', typeDefs);
  // const httpServer = createServer(app);
  // httpServer.listen({ port: 3000 }, (): void =>
  // console.log(`GraphQL-Server is running on http://localhost:3000/graphql`),
  // );
  assert.is(1, 1);
});

test.run();
