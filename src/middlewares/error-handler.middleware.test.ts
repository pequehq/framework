import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/mocks/express.mocks';
import { HttpException, ServerOptions } from '../models';
import { CONFIG_STORAGES } from '../models/constants/config';
import { HTTP_STATES } from '../models/constants/http-states';
import { Config } from '../services/config/config.service';
import { errorHandler } from './error-handler.middleware';

const test = suite('Error handler Middleware');

const expressMocks = new ExpressMocks();

test.before.each(() => {
  expressMocks.restore();

  class TestClass {}

  const config: ServerOptions = {
    rootModule: TestClass,
    showOriginalErrorObject: false,
  };
  Config.set(CONFIG_STORAGES.EXPRESS_SERVER, config);
});

test('should execute the Error handler middleware correctly with HttpException', () => {
  const error = new HttpException({
    error: { test: 'error' },
    statusCode: HTTP_STATES.HTTP_400,
    message: 'test message',
  });

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  errorHandler(error, req, res, next);

  assert.ok(expressMocks.spy('setHeader').calledWith('Content-Type', 'application/json'));
  assert.ok(expressMocks.spy('status').calledWith(HTTP_STATES.HTTP_400));
  assert.ok(expressMocks.spy('send').calledWith(error.httpException));
  assert.ok(expressMocks.spy('end').called);
});

test('should execute the Error handler middleware correctly without HttpException', () => {
  const error = {};

  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  errorHandler(error, req, res, next);

  assert.ok(expressMocks.spy('setHeader').calledWith('Content-Type', 'application/json'));
  assert.ok(expressMocks.spy('status').calledWith(HTTP_STATES.HTTP_500));
  assert.ok(
    expressMocks.spy('send').calledWith({
      error,
      statusCode: HTTP_STATES.HTTP_500,
      message: 'Unknown error.',
    }),
  );
  assert.ok(expressMocks.spy('end').called);
});

test.run();
