import { WebSockets, WebSocketsService } from '../models/dependency-injection/websockets.service'
import { WebSocketClass } from '../models';
import { DECORATORS } from '../models/constants/decorators';
import { Injector } from '../models/dependency-injection/injector.service';
import { NATIVE_SERVICES } from '../models/constants/native-services';

export function WebSocketServer<TOptions, TAdapter>(port: number, config?: { options?: TOptions, adapter: TAdapter }): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DECORATORS.metadata.WEBSOCKETS.CONFIG, { port, config }, target);
    WebSockets.push(target as unknown as WebSocketClass);
  }
}

export const GetWebSocketServer = (): PropertyDecorator => {
  return (target, key) => {
    Object.defineProperty(target, key, {
      get: () => Injector.resolve<WebSocketsService>(NATIVE_SERVICES.WEBSOCKETS).getServer(),
      enumerable: true,
      configurable: true,
    });
  }
}
