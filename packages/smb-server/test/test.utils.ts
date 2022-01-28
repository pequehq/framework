import { DiContainer } from '@peque/di';
import { EventService } from '@peque/smb-commons';
import { loadDI } from '@peque/test';

import { MessageCommand, PublishCommand, SubscribeCommand, UnsubscribeCommand, WelcomeCommand } from '../src/commands';
import { SubscribeService } from '../src/services';

export const DI = new DiContainer();

export const loadProviders = (): void =>
  loadDI(DI, [
    SubscribeService,
    EventService,
    MessageCommand,
    PublishCommand,
    SubscribeCommand,
    UnsubscribeCommand,
    WelcomeCommand,
  ]);
