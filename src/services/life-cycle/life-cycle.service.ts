import { NativeEventsType } from '../../models';
import { getAllInstances } from '../../utils/dependencies.utils';
import { Subjects } from '../subjects/subjects';

export class LifeCycleManagerService {
  private static async triggerLifeCycleEvent(instance: any, method: string): Promise<void> {
    if (typeof instance[method] === 'function') {
      await instance[method]();
    }
  }

  private static async triggerAllModulesLifeCycleEvent(method: string): Promise<void> {
    const instances = getAllInstances();
    for (const instance of instances) {
      await LifeCycleManagerService.triggerLifeCycleEvent(instance, method);
    }
  }

  private static pushEvent(event: NativeEventsType, data = {}): void {
    Subjects.lifeCycleSubject.next({ event, data });
  }

  async triggerProviderInit(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onProviderInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.provider');
  }

  async triggerProviderDestroy(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onProviderDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.provider');
  }

  async triggerModuleInit(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onModuleInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.module');
  }

  async triggerModuleDestroy(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onModuleDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.module');
  }

  async triggerWebSocketsInit(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onWebSocketInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.websocket');
  }

  async triggerWebSocketsDestroy(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onWebSocketDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.websocket');
  }

  async triggerControllerInit(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onControllerInit');
    LifeCycleManagerService.pushEvent('lifecycle.init.controller');
  }

  async triggerControllerDestroy(instance: any): Promise<void> {
    await LifeCycleManagerService.triggerLifeCycleEvent(instance, 'onControllerDestroy');
    LifeCycleManagerService.pushEvent('lifecycle.destroy.controller');
  }

  async triggerServerStarted(): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerStarted');
    LifeCycleManagerService.pushEvent('lifecycle.server.started');
  }

  async triggerServerShutdown(): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerShutdown');
    LifeCycleManagerService.pushEvent('lifecycle.server.shutdown');
  }

  async triggerServerListen(): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerListen');
    LifeCycleManagerService.pushEvent('lifecycle.server.listening');
  }

  async triggerServerListenStop(): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerListenStop');
    LifeCycleManagerService.pushEvent('lifecycle.server.listening.stop');
  }

  async triggerServerBootstrap(): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerBootstrap');
    LifeCycleManagerService.pushEvent('lifecycle.bootstrap');
  }

  async triggerUncaughtException(error: Error): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onServerBootstrap');
    LifeCycleManagerService.pushEvent('lifecycle.uncaught.exception', { error });
  }

  async triggerUncaughtRejection(error: Error): Promise<void> {
    await LifeCycleManagerService.triggerAllModulesLifeCycleEvent('onUncaughtRejection');
    LifeCycleManagerService.pushEvent('lifecycle.uncaught.rejection', { error });
  }
}

export const LifeCycleService = new LifeCycleManagerService();
