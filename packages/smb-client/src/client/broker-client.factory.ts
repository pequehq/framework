import { Container } from '@peque/di';
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
import { SubscribeListenerService } from '../services';
import { BrokerClient } from './broker-client.class';

export class BrokerClientFactory {
  #DI: Container = new Container({
    providers: [
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
      SubscribeListenerService,
      BrokerClient,
    ],
  });

  createClient(): BrokerClient {
    return this.#DI.get<BrokerClient>('BrokerClient');
  }

  getEventService(): EventService {
    return this.#DI.get<EventService>('EventService');
  }
}
