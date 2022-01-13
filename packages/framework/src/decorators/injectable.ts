import { injectableBuilder, injectClass } from './utils/decorators';

export interface CustomProvider {
  interface: string;
}

export const Injectable = (customProvider?: CustomProvider): ClassDecorator => {
  return injectableBuilder({ customProvider });
};

export const Inject = (provider: string): PropertyDecorator => {
  return injectClass(provider);
};
