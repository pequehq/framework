import { randomUUID } from 'crypto';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { validateUUID } from './uuid.validator';

const test = suite('validateUUID');

test('should validate a v4 UUID', () => {
  assert.ok(validateUUID(randomUUID()));
  assert.not.ok(validateUUID('fail test'));
});

test.run();
