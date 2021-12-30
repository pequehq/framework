import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/mocks/express.mocks';
import { HTTP_STATES } from '../models/constants/http-states';
import { fallback } from './fallback.middleware';

const test = suite('Fallback Middleware');

const expressMocks = new ExpressMocks();

test.before.each(() => {
  expressMocks.restore();
});

test('should execute the Fallback middleware correctly', () => {
  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  fallback(req, res, next);
  assert.ok(expressMocks.spy('send').calledWith({ message: 'Route not found.' }));
  assert.ok(expressMocks.spy('status').calledWith(HTTP_STATES.HTTP_404));
});

test.run();
