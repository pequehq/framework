import express from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/test.utils';
import { HTTP_STATES } from '../models/constants/http-states';
import { responder } from './responder.middleware';

const test = suite('Responder Middleware');

test('should responde to the client correctly with set statusCode', () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const body = { statusCode: HTTP_STATES.HTTP_200 };

  const resMock = expressMocks.mockResponse(response, { data: body });
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  responder(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('setHeader').callCount, 1);
  assert.is(expressMocks.spy('status').callCount, 1);
  assert.is(expressMocks.spy('send').callCount, 1);
  assert.is(expressMocks.spy('end').callCount, 1);
  assert.is(response.status, HTTP_STATES.HTTP_200);
  assert.equal(response.header, ['Content-Type', 'application/json']);
  assert.equal(response.body, body);
});

test('should responde to the client correctly without set statusCode', () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};
  const body = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();

  responder(reqMock as express.Request, resMock as express.Response, next.next);
  assert.is(expressMocks.spy('setHeader').callCount, 1);
  assert.is(expressMocks.spy('status').callCount, 1);
  assert.is(expressMocks.spy('send').callCount, 1);
  assert.is(expressMocks.spy('end').callCount, 1);
  assert.is(response.status, HTTP_STATES.HTTP_200);
  assert.equal(response.header, ['Content-Type', 'application/json']);
  assert.equal(response.body, body);
});

test.run();
