import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';

class InjectorService {
  private providers = new Map<string, any>();

  resolve<T>(provider: string): T {
    const matchedProvider = this.providers.get(provider);
    if (matchedProvider) {
      return matchedProvider;
    } else {
      throw new Error(`No provider found for ${provider}!`);
    }
  }

  async set(provider: string, target: any, dependencies: any[] = []): Promise<void> {
    if (!this.providers.get(provider)) {
      const instance = new target(...dependencies);
      await Promise.resolve(LifeCycleService.triggerProviderInit(instance));
      this.providers.set(provider, instance);
    }
  }

  setNative(provider: string, target: any, dependencies: any[] = []): void {
    if (!this.providers.get(provider)) {
      const instance = new target(...dependencies);
      this.providers.set(provider, instance);
    }
  }

  getProviders(): Map<string, any> {
    return this.providers;
  }
}

export const Injector = new InjectorService();
