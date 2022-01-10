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
  #initialized = false;

  protected async initialize(): Promise<void> {
    if (this.#initialized) {
      return;
    }

    processUtils.onTermination(() => this.onTermination());
    processUtils.onUncaughtException((error) => this.onUncaughtException(error));
    processUtils.onUnhandledRejection((error) => this.onUnhandledRejection(error));

    await this.#transportQueue().up();
    await this.#gateways().up();
    await this.#providers().up();

    this.#initialized = true;
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
      async up(): Promise<void> {
        TransportQueue.init();
      },
      async down(): Promise<void> {
        TransportQueue.stopRecycler();
        TransportQueue.clear();
      },
    };
  }

  #gateways(): UpDown {
    return {
      async up(): Promise<void> {
        Gateways.startListening();
      },
      async down(): Promise<void> {
        Gateways.stopListening();
      },
    };
  }

  #providers(): UpDown {
    return {
      async up(): Promise<void> {
        await loadProviders();
      },
      async down(): Promise<void> {
        for (const key of Providers.getProviderInstancesByType('injectable').keys()) {
          await LifeCycleManager.triggerProviderDestroy(key);
        }

        for (const key of Providers.getProviderInstancesByType('interceptor').keys()) {
          await LifeCycleManager.triggerProviderDestroy(key);
        }

        for (const key of Providers.getProviderInstancesByType('microservice').keys()) {
          await LifeCycleManager.triggerProviderDestroy(key);
        }
      },
    };
  }
}
