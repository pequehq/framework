import { Providers } from './models/dependency-injection/provider.service';
import { TransportQueue } from './services';
import { LifeCycleManager } from './services/life-cycle/life-cycle.service';
import { Gateways } from './services/microservice/microservice-gateway.service';
import { loadProviders } from './utils/dependencies.utils';
import { processUtils } from './utils/process.utils';

export interface UpDown {
  up(): Promise<void>;
  down(): Promise<void>;
}

export abstract class PequeBase {
  protected async initialize(): Promise<void> {
    processUtils.onTermination(() => this.onTermination());
    processUtils.onUncaughtException((error) => this.onUncaughtException(error));
    processUtils.onUnhandledRejection((error) => this.onUnhandledRejection(error));

    await this.#transportQueue().up();
    await this.#gateways().up();
    await this.#providers().up();
  }

  protected async teardown(): Promise<void> {
    await this.#transportQueue().down();
    await this.#gateways().down();
    await this.#providers().down();
  }

  protected async onTermination(): Promise<void> {
    process.exit(0);
  }

  protected async onUncaughtException(error: Error): Promise<void> {
    throw error;
  }

  protected async onUnhandledRejection(error: Error): Promise<void> {
    throw error;
  }

  #transportQueue(): UpDown {
    return {
      up: async (): Promise<void> => {
        TransportQueue.init();
      },
      down: async (): Promise<void> => {
        TransportQueue.stopRecycler();
        TransportQueue.clear();
      },
    };
  }

  #gateways(): UpDown {
    return {
      up: async (): Promise<void> => {
        Gateways.startListening();
      },
      down: async (): Promise<void> => {
        Gateways.stopListening();
      },
    };
  }

  #providers(): UpDown {
    return {
      up: async (): Promise<void> => {
        await loadProviders();
      },
      down: async (): Promise<void> => {
        for (const key of Providers.getProviderInstancesByType('injectable').keys()) {
          await LifeCycleManager.triggerProviderDestroy(key);
        }

        for (const key of Providers.getProviderInstancesByType('interceptor').keys()) {
          await LifeCycleManager.triggerProviderDestroy(key);
        }

        for (const key of Providers.getProviderInstancesByType('microservice').keys()) {
          await LifeCycleManager.triggerProviderDestroy(key);
        }

        Providers.unsetAll();
      },
    };
  }
}
