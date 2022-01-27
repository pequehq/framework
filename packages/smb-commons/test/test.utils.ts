import { DiContainer } from 'peque-di';
import { loadDI } from 'peque-test';

import { CommandEmitter, CommandParser, CommandReceiver, EventService, SocketService } from '../src';

export const DI = new DiContainer();

const providers = [EventService, CommandParser, SocketService, CommandEmitter, CommandReceiver];

export const loadProviders = (): void => loadDI(DI, providers);
