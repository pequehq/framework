import 'reflect-metadata';

import { Application, ErrorRequestHandler, RequestHandler } from 'express';

import { guardHandler } from '../../middlewares/guard.middleware';
import { interceptorErrorHandler, interceptorHandler } from '../../middlewares/interceptors.middleware';
import { responder } from '../../middlewares/responder.middleware';
import { LoggerService } from '../../services';
import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { Middlewares } from '../../services/middleware/middleware.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { buildParameters } from '../../utils/express/factory';
import { DECORATORS } from '../constants/decorators';
import { NATIVE_SERVICES } from '../constants/native-services';
import { CanExecute } from '../interfaces/authorization.interface';
import { ControllerDefinition } from '../interfaces/controller-definition.interface';
import { InterceptorHandler } from '../interfaces/interceptor/interceptor.interface';
import { RouteDefinition } from '../interfaces/route-definition.interface';
import { Injector } from './injector.service';

type ControllerClass = { new (...args: unknown[]): unknown };

class ControllerService {
  #controllers: ControllerClass[] = [];
  #instances: InstanceType<ControllerClass>[] = [];

  push(controller: ControllerClass): void {
    this.#controllers.push(controller);
  }

  getAll(): ControllerClass[] {
    return this.#controllers;
  }

  getInstances(): InstanceType<ControllerClass>[] {
    return this.#instances;
  }

  flush(): void {
    this.#instances = [];
    this.#controllers = [];
  }

  async initControllers(application: Application): Promise<void> {
    const logService = Injector.resolve<LoggerService>('injectable', NATIVE_SERVICES.LOGGER);

    // Iterate controllers.
    for (const controller of this.#controllers) {
      const instance = new controller(...getClassDependencies(controller));
      this.#instances.push(instance);
      await LifeCycleManager.triggerControllerInit(instance);

      const controllerMeta: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, controller);
      const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, controller);

      // Controller root interceptors.
      const controllerAfterInterceptors: RequestHandler[] = controllerMeta.interceptors.map((interceptor) =>
        interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'after'),
      );
      const controllerBeforeInterceptors: RequestHandler[] = controllerMeta.interceptors.map((interceptor) =>
        interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'before'),
      );
      const controllerErrorInterceptors: ErrorRequestHandler[] = controllerMeta.interceptors.map((interceptor) =>
        interceptorErrorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name)),
      );

      // Controller root guards.
      application.use(
        controllerMeta.prefix,
        controllerMeta.guards.map((guard) => guardHandler(Injector.resolve<CanExecute>('injectable', guard.name))),
      );

      // Controller root middlewares.
      application.use(controllerMeta.prefix, Middlewares.returnHandlers(controllerMeta.middlewares));

      // Iterate the routes for express registration.
      for (const route of routes) {
        if (route.documentOnly) {
          continue;
        }

        logService.log({
          level: 'debug',
          data: `[${route.requestMethod}] ${controllerMeta.prefix}${route.path}`,
        });

        // Route interceptors.
        const routeBeforeInterceptors: RequestHandler[] = route.interceptors.map((interceptor) =>
          interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'after'),
        );
        const routeAfterInterceptors: RequestHandler[] = route.interceptors.map((interceptor) =>
          interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'before'),
        );
        const routeErrorInterceptors: ErrorRequestHandler[] = route.interceptors.map((interceptor) =>
          interceptorErrorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name)),
        );

        // Route guards.
        const routeGuards: RequestHandler[] = route.guards.map((guard) =>
          guardHandler(Injector.resolve<CanExecute>('injectable', guard.name)),
        );

        // Route middlewares.
        const routeMiddlewares: RequestHandler[] = Middlewares.returnHandlers(route.middlewareFunctions);

        // Route handler.
        const handler: RequestHandler = async (req, res, next): Promise<void> => {
          // Possible override from interceptor.
          if (res.locals.handlerOptions && res.locals.handlerOptions.override) {
            next();
          }

          const result = async (): Promise<any> =>
            (instance as object)[route.method.name](...(await buildParameters(req, res, route)));

          try {
            res.locals.data = await result();
            next();
          } catch (error) {
            next(error);
          }
        };

        // Route registration.
        application[route.requestMethod](
          controllerMeta.prefix + route.path,
          routeGuards,
          routeMiddlewares,
          controllerBeforeInterceptors,
          routeBeforeInterceptors,
          handler,
          controllerAfterInterceptors,
          routeAfterInterceptors,
          responder,
          controllerErrorInterceptors,
          routeErrorInterceptors,
        );
      }
    }
  }

  async destroyControllers(): Promise<void> {
    for (const controller of this.#instances) {
      await LifeCycleManager.triggerControllerDestroy(controller);
    }
  }
}

export const Controllers = new ControllerService();
