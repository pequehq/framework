import express from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/test.utils';
import { Injectable } from '../decorators';
import { HTTP_STATES } from '../models/constants/http-states';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { CanExecute } from '../models/interfaces/authorization.interface';
import { Context } from '../models/interfaces/context.interface';
import { loadInjectables } from '../utils/dependencies.utils';
import { guardHandler } from './guard.middleware';

const test = suite('Guard Middleware');

test.after.each(() => {
  Providers.unsetAll();
});

test('should execute a guard class and allow can execute', async () => {
  @Injectable()
  class TestGuard implements CanExecute {
    async canExecute(context: Context): Promise<boolean> {
      return true;
    }
  }

  await loadInjectables();

  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const guard = Injector.resolve<CanExecute>('injectable', 'TestGuard');
  await guardHandler(guard)(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
});

test('should execute a guard class and deny can execute', async () => {
  @Injectable()
  class TestGuard implements CanExecute {
    async canExecute(context: Context): Promise<boolean> {
      return false;
    }
  }

  await loadInjectables();

  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const guard = Injector.resolve<CanExecute>('injectable', 'TestGuard');
  await guardHandler(guard)(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('status').callCount, 1);
  assert.is(expressMocks.spy('send').callCount, 1);
  assert.is(response.status, HTTP_STATES.HTTP_403);
  assert.equal(response.body, { message: 'Forbidden resource' });
});

test('should throw an error from the guard class', async () => {
  @Injectable()
  class TestGuard implements CanExecute {
    async canExecute(context: Context): Promise<boolean> {
      throw new Error('guard error');
    }
  }

  await loadInjectables();

  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const nextError: { error?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction(nextError);

  const guard = Injector.resolve<CanExecute>('injectable', 'TestGuard');
  await guardHandler(guard)(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('next').callCount, 1);
  assert.instance(nextError.error, Error);
});

test.run();
