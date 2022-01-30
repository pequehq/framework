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
import { SubscribeListenerService } from '../services';
import { BrokerClient } from './broker-client.class';

export class BrokerClientFactory {
  #DI: DiContainer = new DiContainer();

  constructor() {
    const providers = [
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
    ];

    for (const provider of providers) {
      this.#DI.set(provider, provider.name);
    }
  }

  createClient(): BrokerClient {
    return this.#DI.get<BrokerClient>('BrokerClient');
  }

  getEventService(): EventService {
    return this.#DI.get<EventService>('EventService');
  }
}
