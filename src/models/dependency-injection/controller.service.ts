import { Application, ErrorRequestHandler, RequestHandler } from 'express';

import { guardHandler } from '../../middlewares/guard.middleware';
import { interceptorErrorHandler, interceptorHandler } from '../../middlewares/interceptors.middleware';
import { responder } from '../../middlewares/responder.middleware';
import { LoggerService } from '../../services';
import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { buildParameters } from '../../utils/express/factory';
import { DECORATORS } from '../constants/decorators';
import { NATIVE_SERVICES } from '../constants/native-services';
import { ControllerDefinition } from '../controller-definition.interface';
import { CanExecute } from '../interfaces/authorization.interface';
import { InterceptorHandler } from '../interfaces/interceptor/interceptor.interface';
import { RouteDefinition } from '../interfaces/route-definition.interface';
import { ServerOptions } from '../interfaces/server-options.interface';
import { Injector } from './injector.service';

type ControllerClass = { new (...args: unknown[]): unknown };

export class ControllerService {
  private controllers: ControllerClass[] = [];
  private instances: InstanceType<ControllerClass>[] = [];

  push(controller: ControllerClass): void {
    this.controllers.push(controller);
  }

  getAll(): ControllerClass[] {
    return this.controllers;
  }

  getInstances(): InstanceType<ControllerClass>[] {
    return this.instances;
  }

  async initControllers(options: ServerOptions): Promise<Application> {
    const logService = Injector.resolve<LoggerService>('injectable', NATIVE_SERVICES.LOGGER);

    if (!options.existingApp) {
      throw new Error('existingApp not defined'); // @TODO remove after existingApp refactoring
    }

    // Iterate controllers.
    for (const controller of this.controllers) {
      const instance = new controller(...getClassDependencies(controller));
      this.instances.push(instance);
      await LifeCycleService.triggerControllerInit(instance);

      const controllerMeta: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, controller);
      const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, controller);

      let controllerAfterInterceptors: RequestHandler[] = [];
      let controllerBeforeInterceptors: RequestHandler[] = [];
      let controllerErrorInterceptors: ErrorRequestHandler[] = [];

      // Loading interceptors.
      if (controllerMeta.interceptors?.length) {
        controllerAfterInterceptors = controllerMeta.interceptors.map((interceptor) =>
          interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'after'),
        );
        controllerBeforeInterceptors = controllerMeta.interceptors.map((interceptor) =>
          interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'before'),
        );
        controllerErrorInterceptors = controllerMeta.interceptors.map((interceptor) =>
          interceptorErrorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name)),
        );
      }

      // Controller root guards.
      if (controllerMeta.guards?.length) {
        const guards = controllerMeta.guards.map((guard) =>
          guardHandler(Injector.resolve<CanExecute>('injectable', guard.name)),
        );
        options.existingApp.use(controllerMeta.prefix, ...guards);
      }

      // Controller root middlewares.
      if (controllerMeta.middlewares?.length) {
        options.existingApp.use(controllerMeta.prefix, ...controllerMeta.middlewares);
      }

      // Iterate the routes for express registration.
      for (const route of routes) {
        if (route.documentOnly) {
          continue;
        }

        logService.log({
          level: 'debug',
          data: `[${route.requestMethod}] ${controllerMeta.prefix}${route.path}`,
        });

        // Applying interceptors, guards and middlewares.
        let routeBeforeInterceptors: RequestHandler[] = [];
        let routeAfterInterceptors: RequestHandler[] = [];
        let routeErrorInterceptors: ErrorRequestHandler[] = [];
        let routeGuards: RequestHandler[] = [];
        let routeMiddlewares: RequestHandler[] = [];

        if (route.guards?.length) {
          routeGuards = route.guards.map((guard) =>
            guardHandler(Injector.resolve<CanExecute>('injectable', guard.name)),
          );
        }

        if (route.interceptors?.length) {
          routeAfterInterceptors = route.interceptors.map((interceptor) =>
            interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'after'),
          );
          routeBeforeInterceptors = route.interceptors.map((interceptor) =>
            interceptorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name), 'before'),
          );
          routeErrorInterceptors = route.interceptors.map((interceptor) =>
            interceptorErrorHandler(Injector.resolve<InterceptorHandler>('interceptor', interceptor.name)),
          );
        }

        const handler: RequestHandler = async (req, res, next): Promise<unknown | void> => {
          // Possible override from interceptor.
          if (res.locals.handlerOptions && res.locals.handlerOptions.override) {
            next();
          }

          const result = async (): Promise<any> =>
            (instance as object)[route.method.name](...(await buildParameters(req, res, route)));
          if (route.noRestWrapper) {
            return result();
          }

          try {
            res.locals.data = await result();
            next();
          } catch (error) {
            next(error);
          }
        };

        if (route.middlewareFunctions) {
          routeMiddlewares = Array.isArray(route.middlewareFunctions)
            ? [...route.middlewareFunctions]
            : [route.middlewareFunctions];
        }

        // Route registration.
        options.existingApp[route.requestMethod](
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

    return options.existingApp;
  }

  async destroyControllers(): Promise<void> {
    for (const controller of this.instances) {
      await LifeCycleService.triggerControllerDestroy(controller);
    }
  }
}

Injector.setNative('injectable', NATIVE_SERVICES.CONTROLLER, ControllerService);
export const Controllers = Injector.resolve<ControllerService>('injectable', NATIVE_SERVICES.CONTROLLER);
