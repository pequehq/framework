import { getAllInstances } from '../../utils/dependencies.utils';
import { EventManagerService } from '../events/event-manager.service';
import { Injector } from '../../models/dependency-injection/injector.service';
import { NativeEventsType } from '../../models/interfaces/types';

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

  private static pushEvent(event: NativeEventsType, data = {}) {
    Injector.resolve<EventManagerService>('EventManagerService').push('lifecycle.controller', data);
  }

  async triggerProviderInit(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onProviderInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.provider', { instance: instance.name });
  }

  async triggerProviderDestroy(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onProviderDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.provider', { instance: instance.name });
  }

  async triggerModuleInit(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onModuleInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.module', { instance: instance.name });
  }

  async triggerModuleDestroy(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onModuleDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.module', { instance: instance.name });
  }

  async triggerControllerInit(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onControllerInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.controller', { instance: instance.name });
  }

  async triggerControllerDestroy(instance: any) {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onControllerDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.controller', { instance: instance.name });
  }

  async triggerServerStarted() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerStarted');
    LifeCycleManagerService.pushEvent('lifecycle.server.started');
  }

  async triggerServerShutdown() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerShutdown');
    LifeCycleManagerService.pushEvent('lifecycle.server.shutdown');
  }

  async triggerServerListen() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerListen');
    LifeCycleManagerService.pushEvent('lifecycle.server.listening');
  }

  async triggerServerListenStop() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerListenStop');
    LifeCycleManagerService.pushEvent('lifecycle.server.listening.stop');
  }

  async triggerServerBootstrap() {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerBootstrap');
    LifeCycleManagerService.pushEvent('lifecycle.bootstrap');
  }

  async triggerUncaughtException(error: any) {
    LifeCycleManagerService.pushEvent('lifecycle.uncaught.exception', { error });
  }

  async triggerUncaughtRejection(error: any) {
    LifeCycleManagerService.pushEvent('lifecycle.uncaught.rejection', { error });
  }
}

export const LifeCycleService = new LifeCycleManagerService();
