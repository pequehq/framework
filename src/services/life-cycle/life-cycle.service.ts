class LifeCycleManagerService {
  private static async triggerLifeCycleEvent(instance: any, method: string) {
    if (typeof instance[method] === 'function') {
      await instance[method]();
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

  async triggerServerShutdown(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onServerShutdown');
  }
}

export const LifeCycleService = new LifeCycleManagerService();
