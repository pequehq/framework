import 'reflect-metadata';
import { Get, Post, Put, Patch, Delete } from '../src/decorators/express-methods';
import { DECORATORS } from '../src/models/constants/decorators';
import { RouteDefinition } from '../src/models/interfaces/route-definition.interface';
import { Controller } from '../src/decorators/controller';
import { ControllerDefinition } from '../src/models/controller-definition.interface';
import { Injectable } from '../src/decorators/injectable';
import { Injector } from '../src/models/dependency-injection/injector.service';
import { loadInjectables } from '../src/utils/dependencies.utils';
import { Request, Response, Header, Body, Param, Query } from '../src/decorators/parameters';
import exp = require('constants');

const testRoute: RouteDefinition = {
  requestMethod: 'post',
  path: '/test-route',
  method: {
    name: 'testRoute',
    body: [],
    params: [],
    query: [],
    headers: [],
    request: [],
    response: []
  },
  middlewareFunctions: [],
  documentOnly: false,
  noRestWrapper: false
}

const testController: ControllerDefinition = {
  prefix: '/test-controller',
  middlewares: []
}

describe('@Controller() decorator', () => {
  @Controller('/test-controller')
  class TestController {
    testRoute() {
      return;
    }
  }

  it('should contain TestController ControllerDefinition', () => {
    const metadata: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, TestController);
    expect(metadata).toEqual(testController);
  });
});

describe('Routes', () => {
  describe('@Get() decorator', () => {
    class TestController {
      @Get('/test-route')
      testRoute() {
        return;
      }
    }

    it('should contain GET RouteDefinition', () => {
      const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
      testRoute.requestMethod = 'get';
      expect(metadata[0]).toEqual(testRoute);
    });
  });

  describe('@Post() decorator', () => {
    class TestController {
      @Post('/test-route')
      testRoute() {
        return;
      }
    }

    it('should contain POST RouteDefinition', () => {
      const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
      testRoute.requestMethod = 'post';
      expect(metadata[0]).toEqual(testRoute);
    });
  });

  describe('@Put() decorator', () => {
    class TestController {
      @Put('/test-route')
      testRoute() {
        return;
      }
    }

    it('should contain PUT RouteDefinition', () => {
      const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
      testRoute.requestMethod = 'put';
      expect(metadata[0]).toEqual(testRoute);
    });
  });

  describe('@Patch() decorator', () => {
    class TestController {
      @Patch('/test-route')
      testRoute() {
        return;
      }
    }

    it('should contain PATCH RouteDefinition', () => {
      const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
      testRoute.requestMethod = 'patch';
      expect(metadata[0]).toEqual(testRoute);
    });
  });

  describe('@Delete() decorator', () => {
    class TestController {
      @Delete('/test-route')
      testRoute() {
        return;
      }
    }

    it('should contain DELETE RouteDefinition', () => {
      const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
      testRoute.requestMethod = 'delete';
      expect(metadata[0]).toEqual(testRoute);
    });
  });
})

describe('Service providers', () => {
  describe('@Injectable() decorator', () => {
    @Injectable()
    class TestService {
    }

    loadInjectables();

    it('should contain TestService service', () => {
      const testService = Injector.resolve('TestService');
      expect(testService.constructor.name).toEqual(TestService.name);
    });
  });
})

describe('Parameters decorators', () => {
  @Controller('/')
  class TestController {
    @Get('/')
    testRoute(
      @Request() req: any,
      @Response() res: any,
      @Header('header') header: any,
      @Body() body: any,
      @Param('param') param: any,
      @Query('query') query: any
    ) {
      return;
    }
  }

  it('should contain the right REQUEST metadata', () => {
    const testParameter = [{ testRoute: { index: 0, param: undefined } }]
    const parameterMetadata = Reflect.getMetadata('request', TestController) || [];
    expect(parameterMetadata).toEqual(testParameter);
  })

  it('should contain the right RESPONSE metadata', () => {
    const testParameter = [{ testRoute: { index: 1, param: undefined } }]
    const parameterMetadata = Reflect.getMetadata('response', TestController) || [];
    expect(parameterMetadata).toEqual(testParameter);
  })

  it('should contain the right HEADER metadata', () => {
    const testParameter = [{ testRoute: { index: 2, param: 'header' } }]
    const parameterMetadata = Reflect.getMetadata('headers', TestController) || [];
    expect(parameterMetadata).toEqual(testParameter);
  })

  it('should contain the right BODY metadata', () => {
    const testParameter = [{ testRoute: { index: 3 } }]
    const parameterMetadata = Reflect.getMetadata('body', TestController) || [];
    expect(parameterMetadata).toEqual(testParameter);
  })

  it('should contain the right PARAM metadata', () => {
    const testParameter = [{ testRoute: { index: 4, param: 'param' } }]
    const parameterMetadata = Reflect.getMetadata('parameters', TestController) || [];
    expect(parameterMetadata).toEqual(testParameter);
  })

  it('should contain the right QUERY metadata', () => {
    const testParameter = [{ testRoute: { index: 5, param: 'query' } }]
    const parameterMetadata = Reflect.getMetadata('queries', TestController) || [];
    expect(parameterMetadata).toEqual(testParameter);
  })
})
