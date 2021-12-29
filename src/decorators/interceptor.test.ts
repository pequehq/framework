import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ControllerDefinition, HttpException, InterceptorHandler, RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Providers } from '../models/dependency-injection/provider.service';
import { Context } from '../models/interfaces/context.interface';
import { HandlerAfterOptions, HandlerBeforeOptions } from '../models/interfaces/interceptor/handler-options.interface';
import { Controller } from './controller';
import { Get } from './express-methods';
import { Intercept, Interceptor } from './interceptor';

const test = suite('Interceptors');

test.after.each(() => {
  Providers.unsetAll();
});

test('should set an interceptor provider', () => {
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

  const interceptors = Providers.getProvidersByType('interceptor');

  assert.is(interceptors.length, 1);
  assert.equal(interceptors[0], {
    name: 'TestInterceptor',
    clazz: TestInterceptor,
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

  @Intercept(TestInterceptor)
  @Controller('/test')
  class TestController {
    @Intercept(TestInterceptor)
    @Get('/transformer')
    testRoute() {
      return 'testRoute';
    }
  }

  const controllerMetadata: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, TestController);
  assert.is(controllerMetadata.interceptors !== undefined, true);
  assert.is(controllerMetadata.interceptors.length, 1);
  assert.is(controllerMetadata.interceptors[0].name, 'TestInterceptor');

  const routesMetadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
  assert.is(routesMetadata.length, 1);
  assert.is(routesMetadata[0].interceptors !== undefined, true);
  const interceptors = routesMetadata[0].interceptors ? routesMetadata[0].interceptors[0].name : '';
  assert.is(interceptors, 'TestInterceptor');
});

test.run();
