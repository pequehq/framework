import { IReturnType } from '../interfaces';

export function Query(type: IReturnType): MethodDecorator {
  return (target, propertyKey, descriptor) => {};
}
