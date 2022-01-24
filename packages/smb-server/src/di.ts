import { DiContainer } from 'peque-di';
import { CommandEmitter, CommandReceiver, EventService } from 'peque-smb-commons/src';
import { Command, CommandParser } from 'ultra-runner/lib/parser';

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
