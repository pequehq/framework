import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Config } from './config.service';

const test = suite('Config');

test.before.each((context) => {
  const configOne = {
    testProp: 'testValue',
    testArray: [1, 2, 3],
    testObject: {
      testInnerProp: 'testInnerProp',
    },
  };

  const configTwo = { test: 'value' };

  Config.set('test-storage', configOne);
  Config.set('other-test-storage', configTwo);

  context.storage = {
    configOne,
    configTwo,
  };
});

test.after.each(() => {
  Config.flush();
});

test('should set a config storage', (context) => {
  assert.equal(Config.get('test-storage'), context.storage.configOne);
  assert.equal(Config.get('other-test-storage'), context.storage.configTwo);
});

test('should delete a storage', () => {
  Config.delete('test-storage');
  assert.is(Config.get('test-storage'), undefined);
});

test('should flush the storage', () => {
  Config.flush();
  assert.is(Config.get('test-storage'), undefined);
  assert.is(Config.get('other-test-storage'), undefined);
});

test.run();
