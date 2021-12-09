import { Injector } from './injector.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { EventManagerService } from '../../services/events/event-manager.service';
import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';

export class ModuleService {
  private modules = [];
  private instances = [];

  push(modules: any) {
    this.modules.push(modules);
  }

  getAll() {
    return this.modules;
  }

  getInstances() {
    return this.instances;
  }

  initModules() {
    const eventManager = Injector.resolve<EventManagerService>(NATIVE_SERVICES.EVENT_MANAGER);
    this.modules.forEach(async module => {
      const instance = new module();
      this.instances.push(instance);
      await LifeCycleService.triggerModuleInit(instance);
    });
  }

  destroyModules() {
    this.instances.forEach(async module => {
      await LifeCycleService.triggerModuleDestroy(module);
    });
  }
}

Injector.set(NATIVE_SERVICES.MODULE, ModuleService);
export const Modules = Injector.resolve<ModuleService>(NATIVE_SERVICES.MODULE);
