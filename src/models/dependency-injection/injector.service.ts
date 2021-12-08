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

  set(provider: string, target: any, dependencies: any[] = []) {
    if (!this.providers.get(provider)) {
      this.providers.set(provider, new target(...dependencies));
    }
  }

  getProviders(): Map<string, any> {
    return this.providers;
  }
}

export const Injector = new InjectorService();
