import { ClassDeclaration, LifeCycleEvent, LifeCycleEventsType } from '../../models';
import { getAllInstances } from '../../utils/instances.utils';
import { Subjects } from '../subjects/subjects';

class LifeCycleManagerService {
  async #triggerLifeCycleEvent(instance: any, method: string): Promise<void> {
    if (typeof instance[method] === 'function') {
      await instance[method]();
    }
  }

  async #triggerAllModulesLifeCycleEvent(method: string): Promise<void> {
    const instances = getAllInstances();
    for (const instance of instances) {
      await this.#triggerLifeCycleEvent(instance, method);
    }
  }

  #pushEvent(event: LifeCycleEventsType, data = {}): void {
    const lifeCycleData: LifeCycleEvent = { event, data };
    Subjects.lifeCycleSubject.next({ event: { event: 'lifecycle', transport: 'internal' }, data: lifeCycleData });
  }

  async triggerProviderInit(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onProviderInit');
    this.#pushEvent('lifecycle.init.provider', { instance: instance.constructor.name });
  }

  async triggerProviderDestroy(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onProviderDestroy');
    this.#pushEvent('lifecycle.destroy.provider', { instance: instance.constructor.name });
  }

  async triggerModuleInit(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onModuleInit');
    this.#pushEvent('lifecycle.init.module', { instance: instance.constructor.name });
  }

  async triggerModuleDestroy(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onModuleDestroy');
    this.#pushEvent('lifecycle.destroy.module', { instance: instance.constructor.name });
  }

  async triggerWebSocketsInit(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onWebSocketInit');
    this.#pushEvent('lifecycle.init.websocket', { instance: instance.constructor.name });
  }

  async triggerWebSocketsDestroy(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onWebSocketDestroy');
    this.#pushEvent('lifecycle.destroy.websocket', { instance: instance.constructor.name });
  }

  async triggerControllerInit(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onControllerInit');
    this.#pushEvent('lifecycle.init.controller', { instance: instance.constructor.name });
  }

  async triggerControllerDestroy(instance: InstanceType<ClassDeclaration>): Promise<void> {
    await this.#triggerLifeCycleEvent(instance, 'onControllerDestroy');
    this.#pushEvent('lifecycle.destroy.controller', { instance: instance.constructor.name });
  }

  async triggerServerStarted(): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onServerStarted');
    this.#pushEvent('lifecycle.server.started');
  }

  async triggerServerShutdown(): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onServerShutdown');
    this.#pushEvent('lifecycle.server.shutdown');
  }

  async triggerServerListen(): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onServerListen');
    this.#pushEvent('lifecycle.server.listening');
  }

  async triggerServerListenStop(): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onServerListenStop');
    this.#pushEvent('lifecycle.server.listening.stop');
  }

  async triggerServerBootstrap(): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onServerBootstrap');
    this.#pushEvent('lifecycle.bootstrap');
  }

  async triggerUncaughtException(error: Error): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onUncaughtException');
    this.#pushEvent('lifecycle.uncaught.exception', { error });
  }

  async triggerUncaughtRejection(error: Error): Promise<void> {
    await this.#triggerAllModulesLifeCycleEvent('onUncaughtRejection');
    this.#pushEvent('lifecycle.uncaught.rejection', { error });
  }
}

export const LifeCycleManager = new LifeCycleManagerService();
