import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../../test/test.utils';
import { BrokerSocket } from '../../models';
import { SocketService } from './socket.service';

const test = suite('Socket Service');

test.before.each((context) => {
  context.sandbox = sinon.createSandbox();
  context.sandbox.stub(BrokerSocket.prototype, 'destroy');

  loadProviders();

  context.sockets = DI.get<SocketService>('SocketService');
});

test.after.each((context) => {
  context.sockets.closeAll();
  context.sandbox.restore();
  DI.unsetAll();
});

test('should set sockets', (context) => {
  const socketOne = new BrokerSocket();
  socketOne.id = 'id_1';

  context.sockets.set(socketOne);

  assert.is(context.sockets.has(socketOne.id), true);
  assert.is(context.sockets.get(socketOne.id), socketOne);
});

test('should close sockets', (context) => {
  const socketOne = new BrokerSocket();
  socketOne.id = 'id_1';

  const socketTwo = new BrokerSocket();
  socketOne.id = 'id_2';

  context.sockets.set(socketOne);
  context.sockets.set(socketTwo);

  assert.is(context.sockets.has(socketOne.id), true);
  assert.is(context.sockets.has(socketTwo.id), true);
  assert.is(context.sockets.get(socketOne.id), socketOne);
  assert.is(context.sockets.get(socketTwo.id), socketTwo);

  context.sockets.close(socketOne.id);
  assert.is(context.sockets.has(socketOne.id), false);

  context.sockets.closeAll();
  assert.is(context.sockets.has(socketOne.id), false);
  assert.is(context.sockets.has(socketTwo.id), false);
});

test.run();
