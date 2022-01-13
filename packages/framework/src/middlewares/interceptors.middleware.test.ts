import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks, NextError } from '../../test/mocks/express.mocks';
import { Interceptor } from '../decorators';
import { HttpException, InterceptorHandler } from '../models';
import { Context } from '../models';
import { HandlerAfterOptions, HandlerBeforeOptions } from '../models';
import { HTTP_STATES } from '../models/constants/http-states';
import { Injector } from '../models/dependency-injection/dependency-injection.service';
import { loadProviders } from '../utils/dependencies.utils';
import { interceptorErrorHandler, interceptorHandler } from './interceptors.middleware';

const test = suite('Interceptor Middleware');

const expressMocks = new ExpressMocks();

test.before.each(async () => {
  expressMocks.restore();

  @Interceptor()
  class TestInterceptor implements InterceptorHandler {
    after<TResult>(
      context: Context,
      handlerResult: TResult,
    ): HandlerAfterOptions<unknown> | Promise<HandlerAfterOptions<unknown>> | void | Promise<void> {
      return { handlerResult: { test: 'value' } };
    }

    before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void> {
      return { override: false };
    }

    error<TError>(context: Context, error: HttpException<TError>) {
      return;
    }
  }

  @Interceptor()
  class TestInterceptorCatch implements InterceptorHandler {
    after<TResult>(
      context: Context,
      handlerResult: TResult,
    ): HandlerAfterOptions<unknown> | Promise<HandlerAfterOptions<unknown>> | void | Promise<void> {
      return { handlerResult: { test: 'value' } };
    }

    before(context: Context): HandlerBeforeOptions | Promise<HandlerBeforeOptions> | void | Promise<void> {
      throw new Error('Interceptor before catch');
    }

    error<TError>(context: Context, error: HttpException<TError>) {
      throw new Error('Interceptor error catch');
    }
  }

  await loadProviders();
});

test.after.each(async () => {
  await Injector.unsetAll();
});

test('should execute an interceptor class before method', async () => {
  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptor');
  await interceptorHandler(interceptor, 'before')(req, res, next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.equal(res.locals?.handlerOptions, { override: false });
});

test('should execute an interceptor class after method', async () => {
  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptor');
  await interceptorHandler(interceptor, 'after')(req, res, next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.equal(res.locals?.data, { test: 'value' });
});

test('should execute an interceptor class error method', async () => {
  const error = new HttpException({
    error: { test: 'error' },
    statusCode: HTTP_STATES.HTTP_400,
    message: 'test message',
  });

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptor');
  await interceptorErrorHandler(interceptor)(error, req, res, next);
  assert.ok(expressMocks.spy('next').calledWith(error));
});

test('should execute catch an error in the interceptor middleware inside before/after section', async () => {
  const nextError: NextError = {};
  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction(nextError);

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptorCatch');
  await interceptorHandler(interceptor, 'before')(req, res, next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.instance(nextError.error, Error);
});

test('should execute catch an error in the interceptor middleware inside error section', async () => {
  const nextError: NextError = {};
  const error = new HttpException({
    error: { test: 'error' },
    statusCode: HTTP_STATES.HTTP_400,
    message: 'test message',
  });

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction(nextError);

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptorCatch');
  await interceptorErrorHandler(interceptor)(error, req, res, next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.instance(nextError.error, Error);
});

test.run();
