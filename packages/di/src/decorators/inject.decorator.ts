import 'reflect-metadata';

import { META_INJECT } from '../models/constants/metadata.constants';
import { IProviderInject } from '../models';
import { CONTAINER_INJECTABLE } from '../models/constants/containers.constants';

export function Inject(options: IProviderInject): PropertyDecorator & ParameterDecorator {
  return (target, propertyKey, parameterIndex?) => {
    const metadata = new Set<IProviderInject>(Reflect.getMetadata(META_INJECT, target.constructor));
    metadata.add({
      clazz: target,
      identifier: options.identifier,
      propertyKey,
      parameterIndex,
      store: options.store || CONTAINER_INJECTABLE,
    });
    Reflect.defineMetadata(META_INJECT, [...metadata], target.constructor);
  };
}
