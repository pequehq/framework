import { ControllerDefinition, InterceptorClass, RouteDefinition } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { interceptorBuilder } from './utils/decorators';

export const Interceptor = (): ClassDecorator => {
  return interceptorBuilder();
};

export const Intercept = (interceptor: InterceptorClass): MethodDecorator & ClassDecorator => {
  return (target, propertyKey?, descriptor?) => {
    const isClassDecorator = !descriptor;

    if (isClassDecorator) {
      const controller: ControllerDefinition = Reflect.getMetadata(DECORATORS.metadata.CONTROLLER, target);
      controller.interceptors?.push(interceptor);
      Reflect.defineMetadata(DECORATORS.metadata.CONTROLLER, controller, target);
    }

    const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor) ?? [];

    if (routes.length > 0) {
      const index = routes.length - 1;
      routes[index].interceptors ??= [];
      routes[index].interceptors?.push(interceptor);
    }

    Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
  };
};
