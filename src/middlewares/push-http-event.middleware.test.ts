import express from 'express';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks, wait } from '../../test/test.utils';
import { HttpEvent } from '../models';
import { httpEventQueue } from '../services/http-event/http-event.service';
import { pushHttpEvents } from './push-http-event.middleware';

const test = suite('Push HTTP Event Middleware');

test('should push an http event in the http event queue', async () => {
  const expressMocks = new ExpressMocks();
  const response: { status?: number; header?: string[]; body?: unknown } = {};

  const resMock = expressMocks.mockResponse(response);
  const reqMock = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();
  const event: HttpEvent = { req: reqMock };

  const httpQueueNextSpy = sinon.spy(httpEventQueue, 'next');
  assert.is(httpQueueNextSpy.callCount, 0);

  pushHttpEvents(reqMock as express.Request, resMock as express.Response, next.next);

  await wait();

  assert.is(httpQueueNextSpy.callCount, 1);
  assert.ok(httpQueueNextSpy.calledWith(event));
  assert.is(expressMocks.spy('next').callCount, 1);
  httpQueueNextSpy.restore();
});

test.run();
