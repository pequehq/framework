import 'reflect-metadata';

import sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import {
  Body,
  Controller,
  ControllerClass,
  Delete,
  Get,
  Module,
  OnControllerDestroy,
  OnControllerInit,
  Param,
  Patch,
  PequeFactory,
  Post,
  Put,
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
  paramDecorator: sinon.SinonSpy;
  bodyDecorator: sinon.SinonSpy;
}

const test = suite<Context>('Controllers');

test.before(async (context) => {
  context.sandbox = sinon.createSandbox();

  context.onInit = context.sandbox.fake();
  context.onDestroy = context.sandbox.fake();
  context.noReturn = context.sandbox.fake();
  context.paramDecorator = context.sandbox.fake();
  context.bodyDecorator = context.sandbox.fake();

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
      context.paramDecorator(id);
      return true;
    }

    @Get('/multiple-params/:param1/segment/:param2')
    multipleParams(@Param('param1') param1: string, @Param('param2') param2: string): boolean {
      context.paramDecorator(param1, param2);
      return true;
    }

    @Post('/method-post')
    methodPost(@Body() body: any): string {
      context.bodyDecorator(body);
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
  assert.ok(context.paramDecorator.calledWith('123456'));
});

// @TODO investigate why [multipleParams] handler returns error 404.
test.skip('should read multiple path params via the @Param() decorator', async (context) => {
  assert.ok(await http.req('GET /multiple-params/hello/segment/pizza'));
  assert.ok(context.paramDecorator.calledWith('hello', 'pizza'));
});

// @TODO investigate why [methodPost] handler returns error 500.
test.skip('should handle POST requests and retrieve the body via the @Body() decorator', async (context) => {
  const data = { test: 'example payload' };
  assert.is(await http.req('POST /test/method-post', data), 'hello post');
  assert.ok(context.bodyDecorator.calledWith(data));
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

test.run();
