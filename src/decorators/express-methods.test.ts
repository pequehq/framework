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

  test(`@${methodKey}() should allow passing a middleware`, () => {
    const middleware = (_, __, next): void => next();

    class Controller {
      @methodDecorator('/path', middleware)
      handle(): string {
        return 'value';
      }
    }

    const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

    assert.is(metadata.length, 1);
    assert.equal(metadata[0].middlewareFunctions, [middleware]);
  });

  test(`@${methodKey}() should allow passing multiple middlewares`, () => {
    const middleware1 = (_, __, next): void => next();
    const middleware2 = (_, __, next): void => next();

    class Controller {
      @methodDecorator('/path', [middleware1, middleware2])
      handle(): string {
        return 'value';
      }
    }

    const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

    assert.is(metadata.length, 1);
    assert.equal(metadata[0].middlewareFunctions, [middleware1, middleware2]);
  });
}

test.run();
