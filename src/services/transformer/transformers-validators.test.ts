import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { BadRequestException, ServerOptions } from '../../models';
import { CONFIG_STORAGES } from '../../models/constants/config';
import { Config } from '../config/config.service';
import { ToNumber, ToString } from './transformers-validators';

const test = suite('Built-in Transformers/Validators');

test.before(() => {
  class TestClass {}

  const config: ServerOptions = {
    rootModule: TestClass,
    showOriginalErrorObject: false,
  };
  Config.set(CONFIG_STORAGES.EXPRESS_SERVER, config);
});

test('should convert to string', async () => {
  const toString = new ToString();
  assert.is(await toString.transform(12345), '12345');
});

test('should convert to number', async () => {
  const toNumber = new ToNumber();
  assert.is(await toNumber.transform('12345'), 12345);
  try {
    await toNumber.transform('12345abc');
    assert.unreachable('should have thrown');
  } catch (error) {
    assert.instance(error, BadRequestException);
  }
});

test.run();
