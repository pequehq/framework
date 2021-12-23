import { WebSocketClass } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { NATIVE_SERVICES } from '../models/constants/native-services';
import { Injector } from '../models/dependency-injection/injector.service';
import { WebSockets, WebSocketsService } from '../models/dependency-injection/websockets.service';

export function WebSocketServer<TOptions, TAdapter>(
  port: number,
  config?: { options?: TOptions; adapter: TAdapter },
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DECORATORS.metadata.WEBSOCKETS.CONFIG, { port, config }, target);
    WebSockets.push(target as unknown as WebSocketClass);
  };
}

export const GetWebSocketServer = (): PropertyDecorator => {
  return (target, key) => {
    Object.defineProperty(target, key, {
      get: () => Injector.resolve<WebSocketsService>(NATIVE_SERVICES.WEBSOCKETS).getServer(),
      enumerable: true,
      configurable: true,
    });
  };
};
