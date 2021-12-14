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
import { OnEvent, OnEventInterface } from '../src/decorators/events';
import { EventManagerService } from '../src/services/events/event-manager.service';
import { Scheduler, SchedulerConfig } from '../src/decorators/scheduler';
import { SchedulerService } from '../src/services/scheduler/scheduler.service';
import { CanExecute } from '../src/models/interfaces/authorization.interface';
import { Guard } from '../src/decorators/authorization';

describe('Decorator tests', () => {
  beforeAll(async () => await loadInjectables());

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

  const testMiddleware = () => {};
  const testController: ControllerDefinition = {
    prefix: '/test-controller',
    middlewares: [testMiddleware]
  }

  describe('@Controller() decorator', () => {
    @Controller('/test-controller', testMiddleware)
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
    @Injectable()
    class TestGuard implements CanExecute {
      async canExecute(context: any): Promise<boolean> {
        console.log('guard executed');
        return true;
      }
    }


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

    describe('@Guard() decorator', () => {
      class TestController {
        @Guard(TestGuard)
        @Get('/test-route')
        testRoute() {
          return;
        }
      }

      it('should contain DELETE RouteDefinition', () => {
        const metadata: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, TestController);
        expect(metadata[0].guards.length).toBe(1);
        expect(typeof metadata[0].guards[0]).toBe('function');
      });
    });
  })

  describe('Service providers', () => {
    describe('@Injectable() decorator',() => {
      it('should contain TestService service', async () => {
        @Injectable()
        class TestService {
        }

        await loadInjectables();

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
    });

    it('should contain the right RESPONSE metadata', () => {
      const testParameter = [{ testRoute: { index: 1, param: undefined } }]
      const parameterMetadata = Reflect.getMetadata('response', TestController) || [];
      expect(parameterMetadata).toEqual(testParameter);
    })

    it('should contain the right HEADER metadata', () => {
      const testParameter = [{ testRoute: { index: 2, param: 'header' } }]
      const parameterMetadata = Reflect.getMetadata('headers', TestController) || [];
      expect(parameterMetadata).toEqual(testParameter);
    });

    it('should contain the right BODY metadata', () => {
      const testParameter = [{ testRoute: { index: 3 } }]
      const parameterMetadata = Reflect.getMetadata('body', TestController) || [];
      expect(parameterMetadata).toEqual(testParameter);
    });

    it('should contain the right PARAM metadata', () => {
      const testParameter = [{ testRoute: { index: 4, param: 'param' } }]
      const parameterMetadata = Reflect.getMetadata('parameters', TestController) || [];
      expect(parameterMetadata).toEqual(testParameter);
    });

    it('should contain the right QUERY metadata', () => {
      const testParameter = [{ testRoute: { index: 5, param: 'query' } }]
      const parameterMetadata = Reflect.getMetadata('queries', TestController) || [];
      expect(parameterMetadata).toEqual(testParameter);
    });
  });

  describe('@OnEvent() decorator', () => {
    class TestClass {
      @OnEvent('testEvent')
      testMethod() {
        console.log('test');
      }
    }

    it('should contain the right event metadata', () => {
      const eventMap: Map<string, OnEventInterface> = Reflect.getMetadata(DECORATORS.metadata.events.ON_EVENT, EventManagerService) || new Map<string, OnEventInterface>();
      expect(eventMap.size).toBe(1);
    });
  });

  describe('@Scheduler() decorator', () => {
    class TestClass {
      @Scheduler('testEvent', '*/5 * * * * *')
      testMethod() {
        console.log('test');
      }
    }

    it('should contain the right event metadata', () => {
      const eventMap: Map<string, SchedulerConfig> = Reflect.getMetadata(DECORATORS.metadata.SCHEDULER, SchedulerService) || new Map<string, SchedulerConfig>();
      expect(eventMap.size).toBe(1);
    });
  });
});
