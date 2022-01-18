import { IInjectableOptions } from '../models';
import { META_INJECTABLE } from '../models/constants/metadata.constants';

export function Injectable(options?: IInjectableOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(META_INJECTABLE, options, target);
  };
}
