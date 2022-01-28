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

import { MessageCommand, PublishCommand, SubscribeCommand, UnsubscribeCommand } from '../commands';
import { BrokerClient } from './broker-client.class';

export function createClient(): BrokerClient {
  const DI = new DiContainer();

  const providers = [
    EventService,
    EventService,
    CommandError,
    CommandParser,
    CommandReceiver,
    CommandEmitter,
    Command,
    SocketService,
    MessageCommand,
    PublishCommand,
    SubscribeCommand,
    UnsubscribeCommand,
    BrokerClient,
  ];

  for (const provider of providers) {
    DI.set(provider, provider.name);
  }

  return DI.get<BrokerClient>('BrokerClient');
}
