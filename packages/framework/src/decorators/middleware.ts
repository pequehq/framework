import 'reflect-metadata';

import { ControllerDefinition, MiddlewareClass, RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { middlewareBuilder } from './utils/decorators';

export const Middleware = (): ClassDecorator => {
  return middlewareBuilder();
};

export const UseMiddleware = (middleware: MiddlewareClass): MethodDecorator & ClassDecorator => {
  return (target, propertyKey?, descriptor?) => {
    const isClassDecorator = !descriptor;

    if (isClassDecorator) {
      const controller: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, target);
      controller.middlewares.push(middleware);
      Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controller, target);
      return;
    }

    const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor);

    if (routes.length > 0) {
      routes[routes.length - 1].middlewareFunctions.push(middleware);
      Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
    }
  };
};
