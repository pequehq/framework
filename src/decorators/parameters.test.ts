import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { Body, Cookie, Header, Param, Query, Request, Response, Session } from './parameters';

const test = suite('Parameters');

test('should contain the right REQUEST metadata', async () => {
  class TestController {
    testRoute(@Request() req) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.REQUEST, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: undefined } }]);
});

test('should contain the right RESPONSE metadata', async () => {
  class TestController {
    testRoute(@Response() res) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.RESPONSE, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: undefined } }]);
});

test('should contain the right BODY metadata', async () => {
  class TestController {
    testRoute(@Body() body) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.BODY, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: undefined } }]);
});

test('should contain the right PARAM metadata', async () => {
  class TestController {
    testRoute(@Param('foo') param) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.PARAMETERS, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: 'foo' } }]);
});

test('should contain the right QUERY metadata', async () => {
  class TestController {
    testRoute(@Query('foo') query) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.QUERY, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: 'foo' } }]);
});

test('should contain the right HEADER metadata', async () => {
  class TestController {
    testRoute(@Header('authorization') header) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.HEADERS, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: 'authorization' } }]);
});

test('should contain the right COOKIE metadata', async () => {
  class TestController {
    testRoute(@Cookie('access-token') cookie) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.COOKIES, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: 'access-token' } }]);
});

test('should contain the right SESSION metadata', async () => {
  class TestController {
    testRoute(@Session() session) {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.SESSION, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [{ testRoute: { index: 0, param: undefined } }]);
});

test.run();
