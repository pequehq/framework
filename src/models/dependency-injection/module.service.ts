import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { ModuleClass, ModuleInstance } from '../interfaces/types';
import { Injector } from './injector.service';

export class ModuleService {
  private modules: ModuleClass[] = [];
  private instances: ModuleInstance[] = [];

  push(module: ModuleClass): void {
    this.modules.push(module);
  }

  getAll(): ModuleClass[] {
    return this.modules;
  }

  flush(): void {
    this.modules = [];
  }

  getInstances(): ModuleInstance[] {
    return this.instances;
  }

  async initModules(): Promise<void> {
    for (const module of this.modules) {
      const instance = new module();
      this.instances.push(instance);
      await LifeCycleService.triggerModuleInit(instance);
    }
  }

  async destroyModules(): Promise<void> {
    for (const module of this.instances) {
      await LifeCycleService.triggerModuleDestroy(module);
    }
  }
}

Injector.setNative('injectable', NATIVE_SERVICES.MODULE, ModuleService);

export const Modules = Injector.resolve<ModuleService>('injectable', NATIVE_SERVICES.MODULE);
