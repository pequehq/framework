import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { ModuleClass, ModuleInstance } from '../interfaces/types';

class ModuleService {
  private modules: ModuleClass[] = [];
  private instances: ModuleInstance[] = [];

  push(module: ModuleClass): void {
    this.modules.push(module);
  }

  getAll(): ModuleClass[] {
    return this.modules;
  }

  flush(): void {
    this.instances = [];
    this.modules = [];
  }

  getInstances(): ModuleInstance[] {
    return this.instances;
  }

  async initModules(): Promise<void> {
    for (const module of this.modules) {
      const instance = new module();
      this.instances.push(instance);
      await LifeCycleManager.triggerModuleInit(instance);
    }
  }

  async destroyModules(): Promise<void> {
    for (const module of this.instances) {
      await LifeCycleManager.triggerModuleDestroy(module);
    }
  }
}

export const Modules = new ModuleService();
