import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Delete, Get, Patch, Post, Put } from './express-methods';

const test = suite('Express methods');

test('@Get() should make the decorated method handle GET requests', () => {
  class Controller {
    @Get('/path-get')
    handle(): string {
      return 'value';
    }
  }

  const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

  assert.is(metadata.length, 1);
  assert.is(metadata[0].requestMethod, 'get');
  assert.is(metadata[0].path, '/path-get');
  assert.is(metadata[0].method.name, 'handle');
});

test('@Post() should make the decorated method handle POST requests', () => {
  class Controller {
    @Post('/path-post')
    handle(): string {
      return 'value';
    }
  }

  const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

  assert.is(metadata.length, 1);
  assert.is(metadata[0].requestMethod, 'post');
  assert.is(metadata[0].path, '/path-post');
  assert.is(metadata[0].method.name, 'handle');
});

test('@Put() should make the decorated method handle PUT requests', () => {
  class Controller {
    @Put('/path-put')
    handle(): string {
      return 'value';
    }
  }

  const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

  assert.is(metadata.length, 1);
  assert.is(metadata[0].requestMethod, 'put');
  assert.is(metadata[0].path, '/path-put');
  assert.is(metadata[0].method.name, 'handle');
});

test('@Patch() should make the decorated method handle PATCH requests', () => {
  class Controller {
    @Patch('/path-patch')
    handle(): string {
      return 'value';
    }
  }

  const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

  assert.is(metadata.length, 1);
  assert.is(metadata[0].requestMethod, 'patch');
  assert.is(metadata[0].path, '/path-patch');
  assert.is(metadata[0].method.name, 'handle');
});

test('@Delete() should make the decorated method handle DELETE requests', () => {
  class Controller {
    @Delete('/path-delete')
    handle(): string {
      return 'value';
    }
  }

  const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, Controller);

  assert.is(metadata.length, 1);
  assert.is(metadata[0].requestMethod, 'delete');
  assert.is(metadata[0].path, '/path-delete');
  assert.is(metadata[0].method.name, 'handle');
});

test.run();
