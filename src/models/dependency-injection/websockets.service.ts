import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { WebSocketClass, WebSocketInstance } from '../interfaces/types';
import { Injector } from './injector.service';
import { getClassDependencies } from '../../utils/dependencies.utils';
import { WebSocketDefinition } from '../interfaces/websocket-definition.interface';
import { DECORATORS } from '../constants/decorators';
import { Server, Socket } from 'socket.io';
import { EventManager } from '../../services/events/event-manager.service';

export class WebSocketsService {
  private websockets: WebSocketClass[] = [];
  private instances: WebSocketInstance[] = [];
  private sockets = new Set<Socket>();

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

      const webSocketDefinition: WebSocketDefinition = Reflect.getMetadata(DECORATORS.metadata.WEBSOCKETS, webSocket);
      const io = new Server(webSocketDefinition.options);
      io.on('connection', (socket => {
        this.sockets.add(socket);
        socket.on('disconnect', reason => this.sockets.delete(socket));
        socket.onAny((event, args) => {
          EventManager.push(`ws.${event}`, args);
        })
      }));
      io.listen(webSocketDefinition.port);

      await LifeCycleService.triggerWebSocketsInit(instance);
    }
  }

  async destroyWebSockets(): Promise<void> {
    // Ending all the open connections first.
    for (const socket of this.sockets) {
      socket.disconnect(true);
      this.sockets.delete(socket);
    }

    for (const module of this.instances) {
      await LifeCycleService.triggerWebSocketsDestroy(module);
    }
  }
}

Injector.setNative(NATIVE_SERVICES.WEBSOCKETS, WebSocketsService);

export const WebSockets = Injector.resolve<WebSocketsService>(NATIVE_SERVICES.WEBSOCKETS);
