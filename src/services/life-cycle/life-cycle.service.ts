import { getAllInstances } from '../../utils/dependencies.utils';

class LifeCycleManagerService {
  private static async triggerLifeCycleEvent(instance: any, method: string) {
    if (typeof instance[method] === 'function') {
      await instance[method]();
    }
  }

  private static async triggerAllModulesLifeCycleEvent(method: string) {
    const instances = getAllInstances();
    for (const instance of instances) {
      await LifeCycleManagerService.triggerLifeCycleEvent(instance, method);
    }
  }

  async triggerProviderInit(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onProviderInit');
  }

  async triggerProviderDestroy(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onProviderDestroy');
  }

  async triggerModuleInit(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onModuleInit');
  }

  async triggerModuleDestroy(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onModuleDestroy');
  }

  async triggerControllerInit(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onControllerInit');
  }

  async triggerControllerDestroy(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onControllerDestroy');
  }

  async triggerServerStarted() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerStarted');
  }

  async triggerServerShutdown() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerShutdown');
  }

  async triggerServerListen() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerListen');
  }

  async triggerServerListenStop() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerListenStop');
  }
}

export const LifeCycleService = new LifeCycleManagerService();
