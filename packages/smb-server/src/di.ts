import { DiContainer } from '@peque/di';
import {
  Command,
  CommandEmitter,
  CommandError,
  CommandParser,
  CommandReceiver,
  EventService,
  SocketService,
} from '@peque/smb-commons';

import { MessageCommand, PublishCommand, SubscribeCommand, UnsubscribeCommand, WelcomeCommand } from './commands';
import { Broker } from './server/broker.class';
import { SubscribeService } from './services';

export const DI = new DiContainer();

const providers = [
  EventService,
  SocketService,
  SubscribeService,
  CommandError,
  CommandParser,
  CommandReceiver,
  CommandEmitter,
  Command,
  WelcomeCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  MessageCommand,
  PublishCommand,
  Broker,
];

export const loadProviders = (): void => {
  for (const provider of providers) {
    DI.set(provider, provider.name);
  }
};
