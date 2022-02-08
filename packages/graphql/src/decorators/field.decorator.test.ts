import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ObjectTypeFieldsMetadata } from '../constants/metadata.constants';
import { Field } from './field.decorator';
import { ObjectType } from './object-type.decorator';
import { DI } from '../di';
import { SchemaBuilderService } from '../services';

const test = suite('@Field');

test('should load @Field metadata', () => {
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

  console.log(ObjectTypeFieldsMetadata.get(Person));
  const builder = DI.get<SchemaBuilderService>(SchemaBuilderService.name);
  const schema = builder.generateTypes();

  console.log(schema);
  assert.is(1, 1);
});

test.run();
