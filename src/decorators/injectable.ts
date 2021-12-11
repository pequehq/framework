import { injectableBuilder, injectClass } from './utils/decorators';

export interface CustomProvider {
  interface: any;
}

export const Injectable = (customProvider?: CustomProvider): ClassDecorator => {
  // TODO manage custom provider name.
  return injectableBuilder(customProvider);
};

export const Inject = (provider: string): PropertyDecorator => {
  return injectClass(provider);
};
