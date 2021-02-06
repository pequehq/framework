import { MiddlewareHandler } from '../models';
import { controllerBuilder } from './utils/decorators';

export const Controller = (
  prefix = '/',
  middlewares: MiddlewareHandler = []
): ClassDecorator => {
  return controllerBuilder(prefix, middlewares);
};
