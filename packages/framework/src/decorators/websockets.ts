import 'reflect-metadata';

import { WebSocketClass } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { WebSockets } from '../models/dependency-injection/websockets.service';

export function WebSocketServer<TOptions, TAdapter>(
  port: number,
  config?: { options?: TOptions; adapter: TAdapter },
): ClassDecorator {
  return (target): void => {
    Reflect.defineMetadata(DECORATORS.metadata.WEBSOCKETS.CONFIG, { port, config }, target);
    WebSockets.push(target as unknown as WebSocketClass);
  };
}

export const GetWebSocketServer = (): PropertyDecorator => {
  return (target, key): void => {
    Object.defineProperty(target, key, {
      get: () => WebSockets.getServer(),
      enumerable: true,
      configurable: true,
    });
  };
};
