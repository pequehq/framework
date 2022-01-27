import 'reflect-metadata';

import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { DECORATORS } from '../models/constants/decorators';
import { Body, Cookie, Header, Param, Query, Request, Response, Session } from './parameters';

const test = suite('Parameters');

test('@Request() should contain the right REQUEST metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Request() req: ExpressRequest): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.REQUEST, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: undefined,
        transformer: undefined,
      },
    },
  ]);
});

test('@Response() should contain the right RESPONSE metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Response() res: ExpressResponse): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.RESPONSE, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: undefined,
        transformer: undefined,
      },
    },
  ]);
});

test('@Body() should contain the right BODY metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Body() body: Record<string, unknown>): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.BODY, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: undefined,
        transformer: undefined,
      },
    },
  ]);
});

test('@Param should contain the right PARAM metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Param('foo') param: string): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.PARAMETERS, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: 'foo',
        transformer: undefined,
      },
    },
  ]);
});

test('@Query should contain the right QUERY metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Query('foo') query: string): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.QUERY, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: 'foo',
        transformer: undefined,
      },
    },
  ]);
});

test('@Header should contain the right HEADER metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Header('authorization') header: string): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.HEADERS, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: 'authorization',
        transformer: undefined,
      },
    },
  ]);
});

test('@Cookie should contain the right COOKIE metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Cookie('access-token') cookie: string): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.COOKIES, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: 'access-token',
        transformer: undefined,
      },
    },
  ]);
});

test('should contain the right SESSION metadata', async () => {
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    testRoute(@Session() session: string): string {
      return 'value';
    }
  }

  const metadata = Reflect.getMetadata(DECORATORS.metadata.SESSION, TestController) ?? [];

  assert.is(metadata.length, 1);
  assert.equal(metadata, [
    {
      testRoute: {
        index: 0,
        param: undefined,
        transformer: undefined,
      },
    },
  ]);
});

test.run();
