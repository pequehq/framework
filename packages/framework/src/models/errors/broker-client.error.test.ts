import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { BrokerAddressInvalidError } from './broker-client.error';

const test = suite('BrokerAddressInvalidError');

test('should have a message stating that the broker address is invalid', () => {
  assert.throws(() => {
    throw new BrokerAddressInvalidError('localhost:abcd');
  }, 'Broker address invalid: localhost:abcd');
});

test.run();
