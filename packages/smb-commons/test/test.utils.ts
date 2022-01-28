import { DiContainer } from '@peque/di';
import { loadDI } from '@peque/test';

import { CommandEmitter, CommandError, CommandParser, CommandReceiver, EventService, SocketService } from '../src';

export const DI = new DiContainer();

export const loadProviders = (): void =>
  loadDI(DI, [EventService, CommandParser, SocketService, CommandError, CommandEmitter, CommandReceiver]);
