import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ControllerDefinition, HttpException, InterceptorHandler, RouteDefinition } from '../models';
import { Context } from '../models';
import { HandlerAfterOptions, HandlerBeforeOptions } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Providers } from '../models/dependency-injection/provider.service';
import { loadInjectables } from '../utils/dependencies.utils';
import { Controller } from './controller';
import { Get } from './express-methods';
import { Intercept, Interceptor } from './interceptor';

const test = suite('Interceptors');

test.after.each(() => {
  Providers.unsetAll();
});

test('should set an interceptor provider', async () => {
  @Interceptor()
  class TestInterceptor implements InterceptorHandler {
    after<TResult>(
      context: Context,
      handlerResult: TResult,
    ): HandlerAfterOptions<TResult> | Promise<HandlerAfterOptions<TResult>> | void | Promise<void> {
      return;
    }

    before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void> {
      return;
    }

    error<TError>(context: Context, error: HttpException<TError>) {
      return;
    }
  }

  await loadInjectables();

  const interceptors = Providers.getProvidersByType('interceptor');

  assert.is(interceptors.length, 1);
  assert.equal(interceptors[0], {
    name: 'TestInterceptor',
    clazz: TestInterceptor,
    type: 'interceptor',
  });
});

test('should set an interceptor metadata for routes and controllers', async () => {
  @Interceptor()
  class TestInterceptor implements InterceptorHandler {
    after<TResult>(
      context: Context,
      handlerResult: TResult,
    ): HandlerAfterOptions<TResult> | Promise<HandlerAfterOptions<TResult>> | void | Promise<void> {
      return;
    }

    before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void> {
      return;
    }

    error<TError>(context: Context, error: HttpException<TError>) {
      return;
    }
  }

  await loadInjectables();

  @Intercept(TestInterceptor)
  @Controller('/test')
  class TestInterceptorController {
    @Intercept(TestInterceptor)
    @Get('/path')
    testRoute() {
      return 'testRoute';
    }
  }

  const controllerMetadata: ControllerDefinition = Reflect.getMetadata(
    DECORATORS.metadata.CONTROLLER,
    TestInterceptorController,
  );
  assert.is(controllerMetadata.interceptors.length, 1);
  assert.is(controllerMetadata.interceptors[0], TestInterceptor);

  const routesMetadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestInterceptorController);
  assert.is(routesMetadata.length, 1);
  assert.is(routesMetadata[0].interceptors.length, 1);
  assert.is(routesMetadata[0].interceptors[0], TestInterceptor);
});

test.run();
