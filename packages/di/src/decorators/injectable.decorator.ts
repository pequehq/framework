import { IInjectableOptions } from '../models';
import { CONTAINER_INJECTABLE } from '../models/constants/containers.constants';
import { META_INJECTABLE } from '../models/constants/metadata.constants';

export function Injectable(options?: IInjectableOptions): ClassDecorator {
  return (target) => {
    const opts: IInjectableOptions = {
      store: CONTAINER_INJECTABLE,
    };
    Reflect.defineMetadata(META_INJECTABLE, options || opts, target);
  };
}
