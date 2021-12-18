import { ServerOptions } from 'socket.io';
import { WebSockets } from '../models/dependency-injection/websockets.service'
import { WebSocketClass } from '../models/interfaces/types';
import { DECORATORS } from '../models/constants/decorators';

export const WebSocketServer = (port: number, options?: ServerOptions): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(DECORATORS.metadata.WEBSOCKETS, { port, options }, target);
    WebSockets.push(target as unknown as WebSocketClass);
  }
}
