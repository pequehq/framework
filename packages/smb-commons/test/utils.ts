import { DiContainer } from 'peque-di';

import { SocketService } from '../src';

export const DI = new DiContainer();

export const loadProviders = (): void => {
  DI.set(SocketService, SocketService.name);
};
