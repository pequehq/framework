import 'reflect-metadata';

import sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import {
  Body,
  Controller,
  ControllerClass,
  Cookie,
  Delete,
  Get,
  Header,
  Module,
  OnControllerDestroy,
  OnControllerInit,
  Param,
  Patch,
  PequeFactory,
  Post,
  Put,
  Query,
  Request,
  Response,
} from '../../src';
import { PequeWebServer } from '../../src/peque.web-server';
import { http, wait } from '../test.utils';

interface Context {
  sandbox: sinon.SinonSandbox;
  controllerClass: ControllerClass;
  webserver: PequeWebServer;

  // spies
  onInit: sinon.SinonSpy;
  onDestroy: sinon.SinonSpy;
  noReturn: sinon.SinonSpy;
  param: sinon.SinonSpy;
  body: sinon.SinonSpy;
  query: sinon.SinonSpy;
  request: sinon.SinonSpy;
  response: sinon.SinonSpy;
  header: sinon.SinonSpy;
  cookie: sinon.SinonSpy;
}

const test = suite<Context>('Controllers');

test.before(async (context) => {
  context.sandbox = sinon.createSandbox();

  context.onInit = context.sandbox.fake();
  context.onDestroy = context.sandbox.fake();
  context.noReturn = context.sandbox.fake();
  context.param = context.sandbox.fake();
  context.body = context.sandbox.fake();
  context.query = context.sandbox.fake();
  context.request = context.sandbox.fake();
  context.response = context.sandbox.fake();
  context.header = context.sandbox.fake();
  context.cookie = context.sandbox.fake();

  @Controller('/test')
  class TestController implements OnControllerInit, OnControllerDestroy {
    readonly value = 'hello world';

    onControllerInit(): void {
      context.onInit(this);
    }

    onControllerDestroy(): void {
      context.onDestroy(this);
    }

    @Get('/no-return')
    noReturn(): void {
      context.noReturn(this);
    }

    @Get('/return-string')
    returnString(): string {
      return 'hello world';
    }

    @Get('/return-string-async')
    async returnStringAsync(): Promise<string> {
      return await Promise.resolve('hello world');
    }

    @Get('/read-this')
    readThis(): string {
      return this.value;
    }

    @Get('/read-this-async')
    async readThisAsync(): Promise<string> {
      return await Promise.resolve(this.value);
    }

    @Get('/return-object')
    returnObject(): object {
      return { id: 1, name: 'Pippo' };
    }

    @Get('/return-string-list')
    returnStringList(): string[] {
      return ['item1', 'item2', 'item3'];
    }

    @Get('/return-object-list')
    returnObjectList(): object[] {
      return [
        { id: 1, name: 'Pippo' },
        { id: 2, name: 'Pluto' },
      ];
    }

    @Get('/single-param/:id')
    singleParam(@Param('id') id: string): boolean {
      context.param(id);
      return true;
    }

    @Get('/multiple-params/:param1/segment/:param2')
    multipleParams(@Param('param1') param1: string, @Param('param2') param2: string): boolean {
      context.param(param1, param2);
      return true;
    }

    @Post('/method-post')
    methodPost(@Body() body: any): string {
      context.body(body);
      return 'hello post';
    }

    @Delete('/method-delete')
    methodDelete(): string {
      return 'hello delete';
    }

    @Put('/method-put')
    methodPut(): string {
      return 'hello put';
    }

    @Patch('/method-patch')
    methodPatch(): string {
      return 'hello patch';
    }

    @Get('/throw-string')
    throwString(): string {
      throw 'error';
    }

    @Get('/throw-error')
    throwError(): string {
      throw new Error('error');
    }

    @Get('/query-param')
    queryParam(@Query('x') x: string, @Query('y') y: string): boolean {
      context.query(x, y);
      return true;
    }

    @Get('/request')
    request(@Request() request): boolean {
      context.request(request);
      return true;
    }

    @Get('/response')
    response(@Response() response): boolean {
      context.response(response);
      return true;
    }

    @Get('/headers')
    headers(@Header('authorization') authorization, @Header('other-item') otherItem): boolean {
      context.header(authorization, otherItem);
      return true;
    }

    @Get('/cookies')
    cookies(@Cookie('cookie1') cookie1, @Cookie('cookie2') cookie2): boolean {
      context.cookie(cookie1, cookie2);
      return true;
    }
  }

  @Module({
    controllers: [TestController],
  })
  class TestModule {}

  context.controllerClass = TestController;
  context.webserver = PequeFactory.createWebServer({
    rootModule: TestModule,
  });

  await context.webserver.start();
  await wait();
});

test.after(async (context) => {
  await context.webserver.stop(false);
});

test.before.each((context) => {
  context.sandbox.restore();
});

test('should run onControllerInit hook', async (context) => {
  assert.is(context.onInit.callCount, 1);
  assert.ok(context.onInit.calledWith(context.sandbox.match.instanceOf(context.controllerClass)));
});

test.skip('should run onControllerDestroy hook', async (context) => {
  // @TODO implement after start/stop refactoring of components
});

test('should return error 500 if handler does not return', async (context) => {
  try {
    await http.req('GET /test/no-return');
    assert.unreachable();
  } catch (error) {
    assert.match(error, /Request failed with status code 500/);
  }

  assert.is(context.noReturn.callCount, 1);
  assert.ok(context.noReturn.calledWith(context.sandbox.match.instanceOf(context.controllerClass)));
});

test('should return string', async () => {
  assert.is(await http.req('GET /test/return-string'), 'hello world');
});

test('should return string when handler is async', async () => {
  assert.is(await http.req('GET /test/return-string-async'), 'hello world');
});

test('handlers should access "this" of the current controller class', async () => {
  assert.is(await http.req('GET /test/read-this'), 'hello world');
});

test('async handlers should access "this" of the current controller class', async () => {
  assert.is(await http.req('GET /test/read-this-async'), 'hello world');
});

test('should return object', async () => {
  assert.equal(await http.req('GET /test/return-object'), { id: 1, name: 'Pippo' });
});

test('should return array of strings', async () => {
  assert.equal(await http.req('GET /test/return-string-list'), ['item1', 'item2', 'item3']);
});

test('should return array of objects', async () => {
  assert.equal(await http.req('GET /test/return-object-list'), [
    { id: 1, name: 'Pippo' },
    { id: 2, name: 'Pluto' },
  ]);
});

test('should read single path param via the @Param() decorator', async (context) => {
  assert.ok(await http.req('GET /test/single-param/123456'));
  assert.ok(context.param.calledWith('123456'));
});

test('should read multiple path params via the @Param() decorator', async (context) => {
  assert.ok(await http.req('GET /test/multiple-params/hello/segment/pizza'));
  assert.ok(context.param.calledWith('hello', 'pizza'));
});

test('should handle POST requests and retrieve the body via the @Body() decorator', async (context) => {
  const data = { test: 'example payload' };
  assert.is(await http.req('POST /test/method-post', data), 'hello post');
  assert.ok(context.body.calledWith(data));
});

test('should handle DELETE requests', async () => {
  assert.is(await http.req('DELETE /test/method-delete'), 'hello delete');
});

test('should handle PUT requests', async () => {
  assert.is(await http.req('PUT /test/method-put'), 'hello put');
});

test('should handle PATCH requests', async () => {
  assert.is(await http.req('PATCH /test/method-patch'), 'hello patch');
});

test('should throw error when is string', async () => {
  try {
    await http.req('GET /test/throw-string');
    assert.unreachable();
  } catch (error) {
    assert.match(error, /Request failed with status code 500/);
  }
});

test('should throw error when is Error', async () => {
  try {
    await http.req('GET /test/throw-error');
    assert.unreachable();
  } catch (error) {
    assert.match(error, /Request failed with status code 500/);
  }
});

test('should return 404 if route does not exist', async () => {
  try {
    await http.req('GET /not-existing-route');
    assert.unreachable();
  } catch (error) {
    assert.match(error, /Request failed with status code 404/);
  }
});

test('should retrieve query params via the @Query() decorator', async (context) => {
  assert.ok(await http.req('GET /test/query-param?x=value1&y=value2'));
  assert.ok(context.query.calledWith('value1', 'value2'));
});

test('should retrieve the request object via the @Request() decorator', async (context) => {
  await http.req('GET /test/request', undefined, {
    'some-header-key': 'some-header-value',
  });

  assert.ok(context.request.called);

  const request = context.request.getCalls()[0].args[0];
  assert.type(request.hostname, 'string');
  assert.type(request.path, 'string');
  assert.type(request.headers, 'object');
  assert.is(request.headers['some-header-key'], 'some-header-value');
});

test('should retrieve the response object via the @Response() decorator', async (context) => {
  await http.req('GET /test/response');

  assert.ok(context.response.called);
  const response = context.response.getCalls()[0].args[0];
  assert.type(response.send, 'function');
});

test('should retrieve the request headers via the @Header() decorator', async (context) => {
  await http.req('GET /test/headers', undefined, {
    authorization: 'Bearer abc.xyx.token',
    'other-item': 'hello world',
  });

  assert.ok(context.header.calledWith('Bearer abc.xyx.token', 'hello world'));
});

test('should retrieve cookies via the @Cookie() decorator', async (context) => {
  await http.req('GET /test/cookies', undefined, {
    Cookie: 'cookie1=hello; cookie2=pizza;',
  });

  assert.ok(context.cookie.calledWith('hello', 'pizza'));
});

test.run();
