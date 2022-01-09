import * as redis from 'redis';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { RedisBrokerClient, RedisSubscribePayload } from './redis-broker.client';

const test = suite('Redis Broker Client');

test.before.each(async (context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call connect', async (context) => {
  const connectSpy = context.sandbox.fake();
  const mqttConnectStub = context.sandbox.stub(redis, 'createClient').returns({
    connect: connectSpy,
  });

  const client = new RedisBrokerClient('redis://localhost:6379');
  await client.connect();

  assert.is(mqttConnectStub.called, true);
  assert.is(connectSpy.called, true);
});

test('should call subscribe', async (context) => {
  const subscribeFunctionSpy = context.sandbox.spy((event: RedisSubscribePayload) => event);
  const connectSpy = context.sandbox.fake();
  const pSubscribeSpy = context.sandbox.spy((patterns: string, listener: (message: string, channel: string) => void) =>
    listener('message', 'channel'),
  );
  context.sandbox.stub(redis, 'createClient').returns({
    connect: connectSpy,
    pSubscribe: pSubscribeSpy,
  });

  const client = new RedisBrokerClient('redis://localhost:6379');
  await client.connect();

  await client.subscribe(subscribeFunctionSpy);

  assert.is(pSubscribeSpy.called, true);
  assert.is(subscribeFunctionSpy.called, true);
});

test('should call publish', async (context) => {
  const connectSpy = context.sandbox.fake();
  const publishSpy = context.sandbox.fake();
  context.sandbox.stub(redis, 'createClient').returns({
    connect: connectSpy,
    publish: publishSpy,
  });

  const client = new RedisBrokerClient('redis://localhost:6379');
  await client.connect();

  await client.publish({ channel: 'channel', message: 'message' });

  assert.is(publishSpy.called, true);
});

test('should call publish with reject', async (context) => {
  const connectSpy = context.sandbox.fake();
  const publishSpy = context.sandbox.stub().throws({ error: 'error' });
  context.sandbox.stub(redis, 'createClient').returns({
    connect: connectSpy,
    publish: publishSpy,
  });

  const client = new RedisBrokerClient('redis://localhost:6379');
  await client.connect();

  try {
    await client.publish({ channel: 'channel', message: 'message' });
    assert.unreachable('should have thrown');
  } catch (error) {
    console.log('err', error);
    assert.equal(error, { error: 'error' });
  }

  assert.is(publishSpy.called, true);
});

test.run();
