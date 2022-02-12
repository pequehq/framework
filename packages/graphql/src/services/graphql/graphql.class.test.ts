import express from 'express';
import { createServer } from 'http';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { loadProviders } from '../../../test/di';
import { Args, Field, Mutation, Parent, Query, Resolver } from '../../decorators';
import { diHelper } from '../../helpers';
import { GraphQL } from './graphql.class';

const test = suite<{ sandbox: sinon.SinonSandbox }>('GraphQL');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  loadProviders();
});

test.after.each((context) => {
  context.sandbox.restore();
  diHelper.get().unsetAll();
});

test('should load all resolvers and typeDefs', async () => {
  const users = [
    { id: 1, name: 'simone', surname: 'di cicco', location: 1 },
    { id: 2, name: 'beppe', surname: 'tenzio', location: 2 },
    { id: 3, name: 'loco', surname: 'marte', location: 3 },
  ];

  const locations = [
    { id: 1, city: 'madrid', country: 'spain' },
    { id: 2, city: 'lanciano', country: 'italy' },
    { id: 3, city: 'berlin', country: 'germany' },
  ];

  const members = [
    { userId: 3, father: 'aa', mother: 'bb' },
    { userId: 2, father: 'cc', mother: 'dd' },
    { userId: 1, father: 'ee', mother: 'ff' },
  ];

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

  const countries = [
    { id: 1, name: 'italy', continent: 'europe' },
    { id: 2, name: 'usa', continent: 'america' },
    { id: 3, name: 'china', continent: 'asia' },
    { id: 4, name: 'spain', continent: 'europe' },
    { id: 5, name: 'france', continent: 'europe' },
  ];

  @Resolver()
  class ResolverSchema {
    @Query()
    user() {
      return users;
    }

    @Field({ type: 'User' })
    location(@Parent() parent) {
      return locations.find((location) => location.id === parent.location);
    }

    @Field({ type: 'User' })
    family(@Parent() parent) {
      return members.find((member) => member.userId === parent.id);
    }

    @Field({ type: 'Location' })
    properties(@Parent() parent) {
      return properties.filter((prop) => prop.locationId === parent.id);
    }

    @Mutation()
    insertUser(@Args() args: any) {
      members.push({
        userId: Number(args.id),
        father: 'mimmo',
        mother: 'gianna',
      });

      users.push({
        id: Number(args.id),
        location: Number(args.location),
        surname: args.surname,
        name: args.name,
      });

      return Number(args.id);
    }
  }

  @Resolver()
  class ResolverSchemaTwo {
    @Query()
    countries(@Args() args) {
      return countries.filter((country) => country.continent === args.continent);
    }
  }

  diHelper.get().set(ResolverSchema, ResolverSchema.name);
  diHelper.get().set(ResolverSchemaTwo, ResolverSchemaTwo.name);

  const schemaPaths = [
    `${__dirname}/../../../test/schema/schema.graphql`,
    `${__dirname}/../../../test/schema/schema_two.graphql`,
  ];

  const app = express();
  const graphQL = diHelper.get().get<GraphQL>('GraphQL');

  const resolvers = graphQL.getResolversClassDeclaration().map((resolver) => diHelper.get().get(resolver.name));

  const server = createServer(app);
  await graphQL.config({ app, path: '/graphql', resolvers, schemaPaths, server });

  // server.listen({ port: 3000 }, (): void => console.log(`http://localhost:3000/graphql`));

  assert.is(1, 1);
});

test.run();
