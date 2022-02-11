import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const test = suite('@Field');

test('should load @Field metadata', async () => {
  assert.is(1, 1);
});

test.run();
