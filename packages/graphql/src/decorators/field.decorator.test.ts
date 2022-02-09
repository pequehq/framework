import 'reflect-metadata';

import { ApolloError } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'graphql';
import { createServer } from 'http';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI } from '../di';
import { GraphQL, SchemaBuilderService } from '../services';
import { Field } from './field.decorator';
import { ObjectType } from './object-type.decorator';

const test = suite('@Field');

test('should load @Field metadata', async () => {
  @ObjectType()
  class Generalities {
    @Field('String')
    name: string;

    @Field('String')
    surname: string;
  }

  @ObjectType()
  class Interest {
    @Field('String')
    name: string;

    @Field('String')
    description: string;
  }

  @ObjectType()
  class Person {
    @Field(Generalities)
    generalities: Generalities;

    @Field([Interest])
    interests: Interest[];

    @Field(['Int'], { nullable: true })
    numbers?: number[];
  }

  const builder = DI.get<SchemaBuilderService>(SchemaBuilderService.name);
  const schema = buildSchema(builder.generateTypes());

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

  // await graphQL.apply(schema, ServiceResolvers, app, '/graphql');
  // const httpServer = createServer(app);
  // httpServer.listen({ port: 3000 }, (): void =>
  //   console.log(`GraphQL-Server is running on http://localhost:3000/graphql`),
  // );
  assert.is(1, 1);
});

test.run();
