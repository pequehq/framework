import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { wait } from './wait';

const test = suite('wait');

const intervals = {
  short: 100,
  medium: 1000,
  long: 3000,
};

for (const [interval, ms] of Object.entries(intervals)) {
  test(`should wait ${interval} interval`, async () => {
    const t0 = Date.now();

    await wait(interval as keyof typeof intervals);

    assert.ok(Date.now() - t0 >= ms);
  });
}

test(`should wait custom milliseconds`, async () => {
  const t0 = Date.now();

  await wait(123);

  assert.ok(Date.now() - t0 >= 123);
});

test.run();
