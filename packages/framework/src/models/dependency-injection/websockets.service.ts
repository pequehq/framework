import 'reflect-metadata';

import { LifeCycleManager } from '../../services/life-cycle/life-cycle.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { DECORATORS } from '../constants/decorators';
import { NATIVE_SERVICES } from '../constants/native-services';
import { WebSocketClass, WebSocketInstance } from '../interfaces/types';
import { WebSocketAdapter } from '../interfaces/web-sockets/websocket-adapter.interface';
import { WebSocketDefinition } from '../interfaces/websocket-definition.interface';
import { Injector } from './dependency-injection.service';

export class WebSocketsService<TServer = any> {
  #websockets: WebSocketClass[] = [];
  #instances: WebSocketInstance[] = [];
  #adapterService: WebSocketAdapter;
  #server: TServer;

  push(websockets: WebSocketClass): void {
    this.#websockets.push(websockets);
  }

  getAll(): WebSocketClass[] {
    return this.#websockets;
  }

  getInstances(): WebSocketInstance[] {
    return this.#instances;
  }

  async initWebSockets(): Promise<void> {
    for (const webSocket of this.#websockets) {
      const instance = new webSocket(...getClassDependencies(webSocket));
      this.#instances.push(instance);

      const webSocketDefinition: WebSocketDefinition<any, any> = Reflect.getMetadata(
        DECORATORS.metadata.WEBSOCKETS.CONFIG,
        webSocket,
      );
      this.#adapterService = Injector.resolve<WebSocketAdapter>(
        'injectable',
        webSocketDefinition.config?.adapter?.name || NATIVE_SERVICES.SOCKETIO_ADAPTER,
      );

      this.#server = this.#adapterService.create(webSocketDefinition.port, webSocketDefinition.config?.options);
      await LifeCycleManager.triggerWebSocketsInit(instance);
    }
  }

  async destroyWebSockets(): Promise<void> {
    if (this.#adapterService) {
      this.#adapterService.close();
      for (const module of this.#instances) {
        await LifeCycleManager.triggerWebSocketsDestroy(module);
      }
    }
  }

  getServer(): TServer {
    return this.#server;
  }
}

export const WebSockets = new WebSocketsService();
