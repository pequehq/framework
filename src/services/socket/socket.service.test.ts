import { Socket } from 'net';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Sockets } from './socket.service';

const test = suite('Socket');

test.before.each((context) => {
  const socketOne = new Socket();
  const socketTwo = new Socket();

  Sockets.set('http', socketOne);
  Sockets.set('ws', socketTwo);

  context.sockets = {
    one: socketOne,
    two: socketTwo,
  };
});

test.after.each(() => {
  Sockets.closeAll();
});

test('should set a socket', (context) => {
  assert.is(Sockets.has('http', context.sockets.one), true);
  assert.is(Sockets.has('ws', context.sockets.two), true);
});

test('should delete a socket instance', (context) => {
  Sockets.delete('http', context.sockets.one);
  assert.is(Sockets.has('http', context.sockets.one), false);
});

test('should close a socket storage', (context) => {
  Sockets.closeAllByType('http');
  assert.is(Sockets.has('http', context.sockets.one), false);
});

test('should close all socket storages', (context) => {
  Sockets.closeAll();
  assert.is(Sockets.has('http', context.sockets.one), false);
  assert.is(Sockets.has('ws', context.sockets.two), false);
});

test.run();
