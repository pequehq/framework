import 'reflect-metadata';

import { NextFunction, Request, Response } from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ControllerDefinition, MiddlewareHandler, RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { Controller } from './controller';
import { Get } from './express-methods';
import { Middleware, UseMiddleware } from './middleware';

const test = suite('Middlewares');

test.before.each(async (context) => {
  @Middleware()
  class TestMiddleware implements MiddlewareHandler {
    handler(req: Request, res: Response, next: NextFunction): void {
      next();
    }
  }

  await loadInjectables();

  context.middleware = TestMiddleware;
});

test.after.each(() => {
  Providers.unsetAll();
});

test('should load the correct middlewares', async (context) => {
  const middlewares = Providers.getProvidersByType('middleware');
  assert.is(middlewares.length, 1);
  assert.equal(middlewares[0], {
    name: 'TestMiddleware',
    clazz: context.middleware,
    type: 'middleware',
  });
  assert.is.not(Injector.resolve('middleware', context.middleware.name), undefined);
});

test('should set the correct middleware metadata for controllers and routes', (context) => {
  @UseMiddleware(context.middleware)
  @Controller('/test')
  class TestMiddlewareController {
    @UseMiddleware(context.middleware)
    @Get('/testMethod')
    testMethod() {
      // noop.
    }
  }

  const controller: ControllerDefinition = Reflect.getMetadata(
    DECORATORS.metadata.CONTROLLER,
    TestMiddlewareController,
  );
  const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestMiddlewareController);

  assert.is(controller.middlewares.length, 1);
  assert.is(controller.middlewares[0], context.middleware);
  assert.is(routes.length, 1);
  assert.is(routes[0].middlewareFunctions.length, 1);
  assert.is(routes[0].middlewareFunctions[0], context.middleware);
});

test.run();
