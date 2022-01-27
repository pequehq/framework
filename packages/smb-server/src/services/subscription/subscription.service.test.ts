import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DI, loadProviders } from '../../di';
import { SubscribeService } from './subscription.service';

const test = suite('Subscription Service');

test.before.each((context) => {
  loadProviders();
  context.subsService = DI.get<SubscribeService>('SubscribeService');
});

test.after.each((context) => {
  context.subsService.clear();
  DI.unsetAll();
});

test('should set a topic pattern', (context) => {
  assert.instance(context.subsService, SubscribeService);

  context.subsService.set('^to', 'id_1');
  context.subsService.set('topic', 'id_1');
  context.subsService.set('^top', 'id_2');
  assert.is(context.subsService.find('topic').length, 2);
});

test('should unset a topic pattern', (context) => {
  assert.instance(context.subsService, SubscribeService);

  context.subsService.set('^to', 'id_1');
  context.subsService.set('topic', 'id_1');
  context.subsService.set('^top', 'id_2');
  assert.is(context.subsService.find('topic').length, 2);

  context.subsService.unset('^top', 'id_2');
  assert.is(context.subsService.find('topic').length, 1);
});

test('should clear map', (context) => {
  context.subsService.set('^to', 'id_1');
  context.subsService.set('topic', 'id_1');
  context.subsService.set('^top', 'id_2');
  assert.is(context.subsService.find('topic').length, 2);

  context.subsService.clear();
  assert.is(context.subsService.find('topic').length, 0);
});

test.run();
