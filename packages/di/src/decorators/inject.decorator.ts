import 'reflect-metadata';

import { IInjectOptions } from '../models';
import { META_INJECT } from '../models/constants/metadata.constants';
import { getMetadataInject } from '../services/reflection/reflection';

export function Inject(options: IInjectOptions): PropertyDecorator & ParameterDecorator {
  return (target, propertyKey?, parameterIndex?) => {
    const metadata = getMetadataInject(target);
    metadata.push({
      identifier: options.identifier,
      propertyKey,
      parameterIndex,
    });
    Reflect.defineMetadata(META_INJECT, metadata, target.constructor);
  };
}
