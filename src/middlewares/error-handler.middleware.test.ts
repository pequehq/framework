import express from 'express';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/test.utils';
import { HttpException, ServerOptions } from '../models';
import { CONFIG_STORAGES } from '../models/constants/config';
import { HTTP_STATES } from '../models/constants/http-states';
import { Config } from '../services/config/config.service';
import { errorHandler } from './error-handler.middleware';

const test = suite('Error handler Middleware');

test.before.each(() => {
  class TestClass {}

  const config: ServerOptions = {
    rootModule: TestClass,
    showOriginalErrorObject: false,
  };
  Config.set(CONFIG_STORAGES.EXPRESS_SERVER, config);
});

test('should execute the Error handler middleware correctly with HttpException', () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const error = new HttpException({
    error: { test: 'error' },
    statusCode: HTTP_STATES.HTTP_400,
    message: 'test message',
  });

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const nextFunction = expressMocks.mockNextFunction();

  const setHeaderSpy = sinon.spy(resMock, 'setHeader');
  const sendSpy = sinon.spy(resMock, 'send');
  const endSpy = sinon.spy(resMock, 'end');

  errorHandler(error, reqMock as express.Request, resMock as express.Response, nextFunction);
  assert.is(setHeaderSpy.callCount, 1);
  assert.is(sendSpy.callCount, 1);
  assert.is(endSpy.callCount, 1);
  assert.is(response.status, HTTP_STATES.HTTP_400);
  assert.equal(response.header, ['Content-Type', 'application/json']);
  assert.equal(response.body, error.httpException);
});

test('should execute the Error handler middleware correctly without HttpException', () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const error = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const nextFunction = expressMocks.mockNextFunction();

  const setHeaderSpy = sinon.spy(resMock, 'setHeader');
  const sendSpy = sinon.spy(resMock, 'send');
  const endSpy = sinon.spy(resMock, 'end');

  errorHandler(error, reqMock as express.Request, resMock as express.Response, nextFunction);
  assert.is(setHeaderSpy.callCount, 1);
  assert.is(sendSpy.callCount, 1);
  assert.is(endSpy.callCount, 1);
  assert.is(response.status, HTTP_STATES.HTTP_500);
  assert.equal(response.header, ['Content-Type', 'application/json']);
  assert.equal(response.body, {
    statusCode: HTTP_STATES.HTTP_500,
    error,
    message: 'Unknown error.',
  });
});

test.run();
