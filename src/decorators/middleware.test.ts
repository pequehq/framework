import { NextFunction, Request, Response } from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { MiddlewareHandler } from '../models';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { Middleware } from './middleware';

const test = suite('Middlewares');

test.after.each(() => {
  Providers.unsetAll();
});

test('should load the correct middlewares', async () => {
  @Middleware()
  class TestMiddleware implements MiddlewareHandler {
    handler(req: Request, res: Response, next: NextFunction): void {
      next();
    }
  }

  await loadInjectables();

  const middlewares = Providers.getProvidersByType('middleware');
  assert.is(middlewares.length, 1);
  assert.equal(middlewares[0], {
    name: 'TestMiddleware',
    clazz: TestMiddleware,
  });
  assert.is.not(Injector.resolve('middleware', TestMiddleware.name), undefined);
});

test.run();
