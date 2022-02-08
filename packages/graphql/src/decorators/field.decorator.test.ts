import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ObjectTypeFieldsMetadata } from '../constants/metadata.constants';
import { Field } from './field.decorator';
import { ObjectType } from './object-type.decorator';

const test = suite('@Field');

test('should load @Field metadata', () => {
  @ObjectType()
  class Generalities {
    @Field()
    name: string;

    @Field()
    surname: string;
  }

  @ObjectType()
  class Interest {
    @Field()
    name: string;

    @Field()
    description: string;
  }

  @ObjectType()
  class Person {
    @Field((type) => Generalities)
    generalities: Generalities;

    @Field((type) => [Interest])
    interests: Interest[];
    age: number;
  }

  console.log(ObjectTypeFieldsMetadata.get(Person));
  console.log(ObjectTypeFieldsMetadata.get(Interest));
  assert.is(1, 1);
});

test.run();
