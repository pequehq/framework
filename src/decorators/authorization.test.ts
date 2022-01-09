import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { loadProviders } from '../utils/dependencies.utils';
import { Guard } from './authorization';
import { Controller } from './controller';
import { Get } from './express-methods';

const test = suite('Guard');

test.before(async () => {
  await loadProviders();
});

test('should succeed when applied on controller', () => {
  class TestGuard {}

  @Guard(TestGuard)
  @Controller('/')
  class TestController {}

  const controller = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, TestController);

  assert.is(controller.guards.length, 1);
  assert.is(controller.guards[0], TestGuard);
});

test('should succeed when applied on route', () => {
  class TestGuard {}

  @Controller('/')
  class TestController {
    @Guard(TestGuard)
    @Get('/')
    testRoute() {
      // noop
    }
  }

  const routes = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);

  assert.is(routes.length, 1);
  assert.is(routes[0].guards.length, 1);
  assert.is(routes[0].guards[0], TestGuard);
});

test.run();
