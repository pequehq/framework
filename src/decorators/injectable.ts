import { ProviderClass } from '../models';
import { injectClass, injectableBuilder } from './utils/decorators';

export interface CustomProvider {
  interface: ProviderClass | string;
}

export const Injectable = (customProvider?: CustomProvider): ClassDecorator => {
  // @TODO manage custom provider name.
  return injectableBuilder({ type: 'injectable', customProvider });
};

export const Inject = (provider: string): PropertyDecorator => {
  return injectClass(provider);
};
