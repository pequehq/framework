import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { unique } from './unique';

const test = suite('unique');

test('should not alter the input if already unique', () => {
  assert.equal(unique([0, 1, 2, 3]), [0, 1, 2, 3]);
});

test('should default to empty array if input is undefined', () => {
  assert.equal(unique(undefined as any), []);
});

test('should default to empty array if input is null', () => {
  assert.equal(unique(null as any), []);
});

test('should return an array with unique items', () => {
  assert.equal(unique([1, 2, 2, 3, 3]), [1, 2, 3]);

  class Foo {}
  class Bar {}

  assert.equal(unique([Foo, Bar, Foo, Bar, Bar]), [Foo, Bar]);
});

test.run();
