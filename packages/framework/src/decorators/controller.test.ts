import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ControllerDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Controller } from './controller';

const test = suite('Controller');

test('should add controller metadata to the class where it is applied', async () => {
  @Controller('/path')
  class TestController {}

  const metadata: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, TestController);

  assert.equal(metadata, {
    prefix: '/path',
    middlewares: [],
    guards: [],
    interceptors: [],
  });
});

test.run();
