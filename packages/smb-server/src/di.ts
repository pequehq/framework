import { DiContainer } from 'peque-di';
import { Command, CommandEmitter, CommandParser, CommandReceiver, EventService } from 'peque-smb-commons';

import { MessageCommand, PublishCommand, SubscribeCommand, WelcomeCommand } from './commands';
import { Broker } from './server/broker.class';
import { SubscribeService } from './services';

export const DI = new DiContainer();

const providers = [
  EventService,
  SubscribeService,
  CommandParser,
  CommandReceiver,
  CommandEmitter,
  Command,
  WelcomeCommand,
  SubscribeCommand,
  MessageCommand,
  PublishCommand,
  Broker,
];

export const loadProviders = (): void => {
  for (const provider of providers) {
    DI.set(provider, provider.name);
  }
};
