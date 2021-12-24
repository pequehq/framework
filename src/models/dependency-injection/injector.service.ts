import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { ProviderClass, ProviderInstance, ProviderType } from '../interfaces/types';
import { Providers } from './providers';

class InjectorService {
  private providers = new Map<string, ProviderInstance>();

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
      await LifeCycleService.triggerProviderInit(instance);
      Providers.setProviderInstance(type, provider, instance);
    }
  }

  async unset(type: ProviderType, provider: string): Promise<void> {
    await LifeCycleService.triggerProviderDestroy(Providers.getProviderInstanceByType(type, provider));
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

  getProviders(): Map<string, ProviderInstance> {
    return this.providers;
  }
}

export const Injector = new InjectorService();
