import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { ExpressMocks } from '../../test/mocks/express.mocks';
import { wait } from '../../test/test.utils';
import { HttpEvent } from '../models';
import { httpEventQueue } from '../services/http-event/http-event.service';
import { pushHttpEvents } from './push-http-event.middleware';

const test = suite('Push HTTP Event Middleware');

const expressMocks = new ExpressMocks();

test.before.each(() => expressMocks.restore());

test('should push an http event in the http event queue', async () => {
  const res = expressMocks.mockResponse();
  const req = expressMocks.mockRequest();
  const next = expressMocks.mockNextFunction();
  const event: HttpEvent = { req };

  const httpQueueNextSpy = sinon.spy(httpEventQueue, 'next');
  assert.is(httpQueueNextSpy.callCount, 0);

  pushHttpEvents(req, res, next);

  await wait();

  assert.is(httpQueueNextSpy.callCount, 1);
  assert.ok(httpQueueNextSpy.calledWith(event));
  assert.is(expressMocks.spy('next').callCount, 1);
  httpQueueNextSpy.restore();
});

test.run();
