import { DECORATORS } from '../models/constants/decorators';
import { RouteDefinition } from '../models/interfaces/route-definition.interface';

export const Guard = (guard: any) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const routes: RouteDefinition[] = Reflect.getMetadata(DECORATORS.metadata.ROUTES, target.constructor);
    if (routes[routes.length - 1].guards) {
      routes[routes.length - 1].guards.push(guard);
    } else {
      routes[routes.length - 1].guards = [guard];
    }
    Reflect.defineMetadata(DECORATORS.metadata.ROUTES, routes, target.constructor);
    return descriptor;
  };
};
