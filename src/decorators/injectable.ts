import { injectableBuilder, injectClass } from './utils/decorators';

export const Injectable = (provider?: string): ClassDecorator => {
  // TODO manage custom provider name.
  return injectableBuilder(provider);
};

export const Inject = (provider?: string | Function): PropertyDecorator => {
  return injectClass(provider);
};
