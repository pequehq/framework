import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/mocks/express.mocks';
import { Injectable } from '../decorators';
import { HTTP_STATES } from '../models/constants/http-states';
import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../models/dependency-injection/provider.service';
import { CanExecute } from '../models/interfaces/authorization.interface';
import { Context } from '../models/interfaces/context.interface';
import { loadInjectables } from '../utils/dependencies.utils';
import { guardHandler } from './guard.middleware';

const test = suite('Guard Middleware');

const expressMocks = new ExpressMocks();

test.before.each(() => {
  expressMocks.restore();
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

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const guard = Injector.resolve<CanExecute>('injectable', 'TestGuard');
  await guardHandler(guard)(req, res, next);
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

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const guard = Injector.resolve<CanExecute>('injectable', 'TestGuard');
  await guardHandler(guard)(req, res, next);
  assert.ok(expressMocks.spy('status').calledWith(HTTP_STATES.HTTP_403));
  assert.ok(expressMocks.spy('send').calledWith({ message: 'Forbidden resource' }));
});

test('should throw an error from the guard class', async () => {
  const error = new Error('guard error');

  @Injectable()
  class TestGuard implements CanExecute {
    async canExecute(context: Context): Promise<boolean> {
      throw error;
    }
  }

  await loadInjectables();

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const guard = Injector.resolve<CanExecute>('injectable', 'TestGuard');
  await guardHandler(guard)(req, res, next);
  assert.ok(expressMocks.spy('next').calledWith(error));
});

test.run();
