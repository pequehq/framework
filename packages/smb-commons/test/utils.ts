import { DiContainer } from 'peque-di';

import { CommandParser, SocketService } from '../src';

export const DI = new DiContainer();

const providers = [CommandParser, SocketService];
export const loadProviders = (): void => {
  for (const provider of providers) {
    DI.set(provider, provider.name);
  }
};
