import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { CompleteTransportQueueItem } from '../../../models';
import { RedisBrokerClient, RedisSubscribePayload } from '../../redis/redis-broker.client';
import { RedisGateway, RedisGatewayService } from './redis-gateway.service';

const test = suite('Redis Microservice Gateway');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should call the register correctly', async (context) => {
  const redisClientConnectSpy = context.sandbox.stub(RedisBrokerClient.prototype, 'connect');

  await RedisGateway.register({ broker: 'redis://localhost:6379', transport: 'mqtt' });
  assert.is(redisClientConnectSpy.called, true);
});

test('should call the register correctly', async (context) => {
  const redisClientConnectStub = context.sandbox.stub(RedisBrokerClient.prototype, 'connect');

  await RedisGateway.register({ broker: 'redis://localhost:6379', transport: 'mqtt' });
  assert.is(redisClientConnectStub.called, true);
});

test('should call the subscribe correctly', (context) => {
  const cb: RedisSubscribePayload = { channel: 'text_event', message: `{ "data": "test" }` };
  const redisClientSubscribeStub = context.sandbox.stub(RedisBrokerClient.prototype, 'subscribe').callsArgWith(0, cb);

  const client = new RedisBrokerClient('redis://localhost:6379');

  RedisGateway.subscribe(client);
  assert.is(redisClientSubscribeStub.called, true);
});

test('should call the publish correctly', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'redis',
    broker: 'redis://localhost:6379',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const redisClientConnectStub = context.sandbox.stub(RedisBrokerClient.prototype, 'publish');
  const redisGatewaySpy = context.sandbox.spy(RedisGatewayService.prototype, 'successPublish');
  const client = new RedisBrokerClient('redis://localhost:6379');

  await RedisGateway.publish(client, event);
  assert.is(redisClientConnectStub.called, true);
  assert.ok(redisGatewaySpy.calledWith(event));
});

test('should call the publish and throw', async (context) => {
  const event: CompleteTransportQueueItem = {
    event: 'test_event',
    data: { test: 'data', timestamp: Date.now() },
    transport: 'redis',
    broker: 'redis://localhost:6379',
    timestamp: Date.now(),
    id: 'id',
    retry: 0,
  };
  const redisClientPublishStub = context.sandbox.stub(RedisBrokerClient.prototype, 'publish').throws();
  const redisGatewaySpy = context.sandbox.spy(RedisGatewayService.prototype, 'failedPublish');
  const client = new RedisBrokerClient('redis://localhost:6379');

  await RedisGateway.publish(client, event);
  assert.is(redisClientPublishStub.called, true);
  assert.ok(redisGatewaySpy.calledWith(event));
});

test.run();
