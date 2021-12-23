import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { WebSocketClass, WebSocketInstance } from '../interfaces/types';
import { Injector } from './injector.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { WebSocketDefinition } from '../interfaces/websocket-definition.interface';
import { DECORATORS } from '../constants/decorators';
import { WebSocketAdapter } from '../interfaces/web-sockets/websocket-adapter.interface';

export class WebSocketsService<TServer = any> {
  private websockets: WebSocketClass[] = [];
  private instances: WebSocketInstance[] = [];
  private adapterService: WebSocketAdapter;
  private server: TServer;

  push(websockets: WebSocketClass): void {
    this.websockets.push(websockets);
  }

  getAll(): WebSocketClass[] {
    return this.websockets;
  }

  getInstances(): WebSocketInstance[] {
    return this.instances;
  }

  async initWebSockets(): Promise<void> {
    for (const webSocket of this.websockets) {
      const instance = new webSocket(...getClassDependencies(webSocket));
      this.instances.push(instance);

      const webSocketDefinition: WebSocketDefinition<any, any> = Reflect.getMetadata(DECORATORS.metadata.WEBSOCKETS.CONFIG, webSocket);
      this.adapterService = Injector.resolve<WebSocketAdapter>(webSocketDefinition.config?.adapter?.name || NATIVE_SERVICES.SOCKETIO_ADAPTER);

      this.server = this.adapterService.create(webSocketDefinition.port, webSocketDefinition.config?.options);
      await LifeCycleService.triggerWebSocketsInit(instance);
    }
  }

  async destroyWebSockets(): Promise<void> {
    this.adapterService.close();
    for (const module of this.instances) {
      await LifeCycleService.triggerWebSocketsDestroy(module);
    }
  }

  getServer(): TServer {
    return this.server;
  }
}

Injector.setNative(NATIVE_SERVICES.WEBSOCKETS, WebSocketsService);

export const WebSockets = Injector.resolve<WebSocketsService>(NATIVE_SERVICES.WEBSOCKETS);
