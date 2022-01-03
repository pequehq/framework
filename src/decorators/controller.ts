import { controllerBuilder } from './utils/decorators';

export const Controller = (prefix = '/'): ClassDecorator => {
  return controllerBuilder(prefix);
};
