import { ProviderClass } from '../models';
import { injectableBuilder, injectClass } from './utils/decorators';

export interface CustomProvider {
  interface: ProviderClass | string;
}

export const Injectable = (customProvider?: CustomProvider): ClassDecorator => {
  // @TODO manage custom provider name.
  return injectableBuilder(customProvider);
};

export const Inject = (provider: string): PropertyDecorator => {
  return injectClass(provider);
};
