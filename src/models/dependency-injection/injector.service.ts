import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';
import { Providers } from './provider.service';

class InjectorService {
  resolve<TClass extends ProviderInstance>(type: ProviderType, provider: string): TClass {
    const matchedProvider = Providers.getProviderInstanceByType(type, provider) as TClass;
    if (!matchedProvider) {
      throw new Error(`No provider found for ${provider}!`);
    }

    return matchedProvider;
  }

  async set(
    type: ProviderType,
    provider: string,
    target: ProviderClass,
    dependencies: ProviderInstance[] = [],
  ): Promise<void> {
    if (!Providers.hasProviderInstance(type, provider)) {
      const instance = new target(...dependencies);
      Providers.setProviderInstance(type, provider, instance);
      await LifeCycleManager.triggerProviderInit(instance);
    }
  }

  async unset(type: ProviderType, provider: string): Promise<void> {
    Providers.deleteProviderInstance(type, provider);
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

export const Injector = new InjectorService();
