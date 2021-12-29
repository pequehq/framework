import express from 'express';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/test.utils';
import { HTTP_STATES } from '../models/constants/http-states';
import { fallback } from './fallback.middleware';

const test = suite('Fallback Middleware');

test('should execute the Fallback middleware correctly', () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  const sendSpy = sinon.spy(resMock, 'send');

  fallback(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(sendSpy.callCount, 1);
  assert.is(response.status, HTTP_STATES.HTTP_404);
});

test.run();
