import 'reflect-metadata';

import { Handler, NextFunction, Request, Response } from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Controller, Get, Middleware, UseMiddleware } from '../../decorators';
import { ControllerDefinition, MiddlewareHandler, RouteDefinition } from '../../models';
import { DECORATORS } from '../../models/constants/decorators';
import { Providers } from '../../models/dependency-injection/provider.service';
import { loadProviders } from '../../utils/dependencies.utils';
import { Middlewares } from './middleware.service';

const test = suite('Middleware service');

test.before.each(async (context) => {
  @Middleware()
  class TestMwMiddleware implements MiddlewareHandler {
    handler(req: Request, res: Response, next: NextFunction): void {
      next();
    }
  }

  await loadProviders();

  @UseMiddleware(TestMwMiddleware)
  @Controller('/test')
  class TestMiddlewareController {
    @UseMiddleware(TestMwMiddleware)
    @Get('/testMethod')
    testMethod() {
      // noop.
    }
  }

  context.controller = TestMiddlewareController;
});

test.after.each(() => {
  Providers.unsetAll();
});

test('should return an array of middleware handlers', (context) => {
  const controller: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, context.controller);
  const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, context.controller);
  const controllerMws: Handler[] = Middlewares.returnHandlers(controller.middlewares);
  const routeMws: Handler[] = Middlewares.returnHandlers(routes[0].middlewareFunctions);

  assert.is(controllerMws.length, 1);
  assert.is(routeMws.length, 1);
  assert.is(controllerMws[0].name, 'handler');
  assert.is(routeMws[0].name, 'handler');
});

test.run();
