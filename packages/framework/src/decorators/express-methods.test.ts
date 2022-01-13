import 'reflect-metadata';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Delete, Get, Patch, Post, Put } from './express-methods';

const test = suite('Express methods');

for (const [methodKey, methodDecorator] of Object.entries({ Get, Post, Patch, Put, Delete })) {
  test(`@${methodKey}() should make the decorated method handle ${methodKey.toUpperCase()} requests`, () => {
    class Controller {
      @methodDecorator('/path')
      handle(): string {
        return 'value';
      }
    }

    const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

    assert.is(metadata.length, 1);
    assert.is(metadata[0].requestMethod, methodKey.toLowerCase());
    assert.is(metadata[0].path, '/path');
    assert.is(metadata[0].method.name, 'handle');
  });
}

test.run();
