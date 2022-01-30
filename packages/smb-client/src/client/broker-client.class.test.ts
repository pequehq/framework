import {
  BrokerSocket,
  Command,
  CommandParser,
  EventService,
  IMessageCommand,
  ISubscribeCommand,
  IUnsubscribeCommand,
  SocketService,
} from '@peque/smb-commons';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { SubscribeListenerService } from '../services';
import { BrokerClient } from './broker-client.class';
import { BrokerClientFactory } from './broker-client.factory';
import { BrokerConnectionTimeoutException } from '../models';

const test = suite('Broker Client');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.spies = {
    commandInit: context.sandbox.spy(Command.prototype, 'init'),
    commandParser: context.sandbox.spy(CommandParser.prototype, 'cast'),
    socketOn: context.sandbox.spy(BrokerSocket.prototype, 'on'),
    socketRemoveAllListeners: context.sandbox.spy(BrokerSocket.prototype, 'removeAllListeners'),
    eventsOn: context.sandbox.spy(EventService.prototype, 'on'),
    eventsNext: context.sandbox.spy(EventService.prototype, 'next'),
    eventsRemove: context.sandbox.spy(EventService.prototype, 'remove'),
    socketsSet: context.sandbox.spy(SocketService.prototype, 'set'),
    subsServiceSet: context.sandbox.spy(SubscribeListenerService.prototype, 'set'),
    subsServiceUnset: context.sandbox.spy(SubscribeListenerService.prototype, 'unset'),
  };
  context.stubs = {
    socketConnect: context.sandbox.stub(BrokerSocket.prototype, 'connect'),
    socketWrite: context.sandbox.stub(BrokerSocket.prototype, 'write'),
  };
  context.clientFactory = new BrokerClientFactory();
  context.welcomeMessage = () =>
    setTimeout(
      () =>
        context.clientFactory.getEventService().next('welcome', {
          command: 'welcome',
          action: '',
          socketId: 'id_1',
          issueTimestamp: Date.now(),
        }),
      100,
    );
});

test.after.each((context) => {
  context.sandbox.restore();
});

test('should create client', (context) => {
  assert.instance(context.clientFactory.createClient(), BrokerClient);
  assert.is(context.spies.commandInit.calledOnce, true);
});

test('should make a connection', async (context) => {
  const brokerClient = context.clientFactory.createClient();
  context.welcomeMessage();

  const clientId = await brokerClient.connect();

  assert.is(context.stubs.socketConnect.calledOnce, true);
  assert.ok(context.stubs.socketConnect.calledWith({ port: 8021, host: '127.0.0.1' }));

  const setWelcomeEvent = context.spies.eventsOn.args.filter((array) => array[0] === 'welcome');
  assert.is(setWelcomeEvent[0][0], 'welcome');

  const removeWelcomeEvent = context.spies.eventsRemove.args.filter((array) => array[0] === 'welcome');
  assert.is(removeWelcomeEvent[0][0], 'welcome');

  assert.is(context.spies.socketsSet.calledOnce, true);
  assert.instance(context.spies.socketsSet.args[0][0], BrokerSocket);
  assert.is(context.spies.socketsSet.args[0][0].id, 'id_1');

  assert.is(context.spies.socketOn.called, true);
  assert.is(context.spies.socketOn.args.filter((args) => args[0] === 'data').length, 1);
  assert.is(clientId, 'id_1');
});

test('should timeout a connection', async (context) => {
  const brokerClient = context.clientFactory.createClient();

  try {
    await brokerClient.connect({ connectionTimeout: 500 });
  } catch (error) {
    assert.instance(error, BrokerConnectionTimeoutException);
    assert.is(context.spies.socketRemoveAllListeners.calledOnce, true);
    assert.ok(context.spies.socketRemoveAllListeners.calledWith('data'));
  }
});

test('should send subscribe command', async (context) => {
  const subscription: ISubscribeCommand = {
    command: 'subscribe',
    action: { topic: 'topic' },
    socketId: 'id_1',
    issueTimestamp: Date.now(),
  };

  const brokerClient = context.clientFactory.createClient();
  context.welcomeMessage();

  await brokerClient.connect();

  brokerClient.subscribe('topic', context.sandbox.fake());
  assert.is(context.spies.subsServiceSet.calledOnce, true);
  assert.is(context.spies.subsServiceSet.lastCall.firstArg, 'topic');

  // Getting the timestamps, which are the only not predictable values.
  const subscriptionTimestamp = context.spies.eventsNext.args.filter((array) => array[0] === 'subscribe');
  subscription.issueTimestamp = subscriptionTimestamp[0][1].issueTimestamp;
  assert.ok(context.spies.eventsNext.calledWith('subscribe', subscription));
});

test('should send unsubscribe command', async (context) => {
  const unsubscription: IUnsubscribeCommand = {
    command: 'unsubscribe',
    action: { topic: 'topic' },
    socketId: 'id_1',
    issueTimestamp: Date.now(),
  };

  const brokerClient = context.clientFactory.createClient();
  context.welcomeMessage();

  await brokerClient.connect();

  brokerClient.unsubscribe('topic');
  assert.is(context.spies.subsServiceUnset.calledOnce, true);
  assert.is(context.spies.subsServiceUnset.lastCall.firstArg, 'topic');

  // Getting the timestamps, which are the only not predictable values.
  const unsubscriptionTimestamp = context.spies.eventsNext.args.filter((array) => array[0] === 'unsubscribe');
  unsubscription.issueTimestamp = unsubscriptionTimestamp[0][1].issueTimestamp;
  assert.ok(context.spies.eventsNext.calledWith('unsubscribe', unsubscription));
});

test('should send message command', async (context) => {
  const message: IMessageCommand = {
    command: 'message',
    action: { topic: 'topic', message: JSON.stringify({ foo: 1 }) },
    socketId: 'id_1',
    issueTimestamp: Date.now(),
  };

  const brokerClient = context.clientFactory.createClient();
  context.welcomeMessage();

  await brokerClient.connect();

  brokerClient.message('topic', { foo: 1 });

  // Getting the timestamps, which are the only not predictable values.
  const messageTimestamp = context.spies.eventsNext.args.filter((array) => array[0] === 'message');
  message.issueTimestamp = messageTimestamp[0][1].issueTimestamp;
  assert.ok(context.spies.eventsNext.calledWith('message', message));
});

test.run();
