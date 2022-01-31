import { Container } from '@peque/di';
import { EventService } from '@peque/smb-commons';
import { loadDI } from '@peque/test';

import { MessageCommand, PublishCommand, SubscribeCommand, UnsubscribeCommand } from '../src';
import { SubscribeListenerService } from '../src';

export const DI = new Container();

export const loadProviders = (): void =>
  loadDI(DI, [
    SubscribeListenerService,
    EventService,
    MessageCommand,
    PublishCommand,
    SubscribeCommand,
    UnsubscribeCommand,
  ]);
