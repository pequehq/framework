import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';
import { Providers } from './provider.service';

class InjectorService<TProviderType extends string> {
  resolve<TClass extends ProviderInstance>(type: TProviderType, provider: string): TClass {
    const matchedProvider = Providers.getProviderInstanceByType<TProviderType>(type, provider) as TClass;
    if (!matchedProvider) {
      throw new Error(`No provider found for ${provider}!`);
    }

    return matchedProvider;
  }

  async set(
    type: TProviderType,
    provider: string,
    target: ProviderClass,
    dependencies: ProviderInstance[] = [],
  ): Promise<void> {
    if (!Providers.hasProviderInstance<TProviderType>(type, provider)) {
      const instance = new target(...dependencies);
      Providers.setProviderInstance<TProviderType>(type, provider, instance);
      await LifeCycleManager.triggerProviderInit(instance);
    }
  }

  async unset(type: TProviderType, provider: string): Promise<void> {
    Providers.deleteProviderInstance<TProviderType>(type, provider);
  }

  setNative(
    type: ProviderType,
    provider: string,
    target: ProviderClass | ProviderInstance,
    dependencies: ProviderInstance[] = [],
    createInstance = true,
  ): void {
    if (!Providers.hasProviderInstance(type, provider)) {
      const instance = createInstance ? new target(...dependencies) : target;
      Providers.setProviderInstance(type, provider, instance);
    }
  }
}

export const Injector = new InjectorService<ProviderType>();
