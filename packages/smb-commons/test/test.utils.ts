import { Container } from '@peque/di';
import { loadDI } from '@peque/test';

import { CommandEmitter, CommandError, CommandParser, CommandReceiver, EventService, SocketService } from '../src';

export const DI = new Container();

const providers = [EventService, CommandParser, SocketService, CommandError, CommandEmitter, CommandReceiver];

export const loadProviders = (): void => loadDI(DI, providers);
