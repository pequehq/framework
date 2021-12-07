import { injectableBuilder, injectClass } from './utils/decorators';

export const Injectable = (provider?: string): ClassDecorator => {
  // TODO manage custom provider name.
  return injectableBuilder(provider);
};

export const Inject = (provider: string): PropertyDecorator => {
  return injectClass(provider);
};
