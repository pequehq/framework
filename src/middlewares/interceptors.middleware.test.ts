import express from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/test.utils';
import { Interceptor } from '../decorators';
import { HttpException, InterceptorHandler } from '../models';
import { HTTP_STATES } from '../models/constants/http-states';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { Context } from '../models/interfaces/context.interface';
import { HandlerAfterOptions, HandlerBeforeOptions } from '../models/interfaces/interceptor/handler-options.interface';
import { loadInjectables } from '../utils/dependencies.utils';
import { interceptorErrorHandler, interceptorHandler } from './interceptors.middleware';

const test = suite('Interceptor Middleware');

test.before.each(async () => {
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

  await loadInjectables();
});

test.after.each(() => {
  Providers.unsetAll();
});

test('should execute an interceptor class before method', async () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptor');
  await interceptorHandler(interceptor, 'before')(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.equal(resMock.locals?.handlerOptions, { override: false });
});

test('should execute an interceptor class after method', async () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptor');
  await interceptorHandler(interceptor, 'after')(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.equal(resMock.locals?.data, { test: 'value' });
});

test('should execute an interceptor class error method', async () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const nextError: { error?: unknown } = {};
  const error = new HttpException({
    error: { test: 'error' },
    statusCode: HTTP_STATES.HTTP_400,
    message: 'test message',
  });

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction(nextError);

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptor');
  await interceptorErrorHandler(interceptor)(error, reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.instance(nextError.error, HttpException);
});

test('should execute catch an error in the interceptor middleware inside before/after section', async () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const nextError: { error?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction(nextError);

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptorCatch');
  await interceptorHandler(interceptor, 'before')(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.instance(nextError.error, Error);
});

test('should execute catch an error in the interceptor middleware inside error section', async () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const nextError: { error?: unknown } = {};
  const error = new HttpException({
    error: { test: 'error' },
    statusCode: HTTP_STATES.HTTP_400,
    message: 'test message',
  });

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction(nextError);

  const interceptor = Injector.resolve<InterceptorHandler>('interceptor', 'TestInterceptorCatch');
  await interceptorErrorHandler(interceptor)(error, reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.instance(nextError.error, Error);
});

test.run();
