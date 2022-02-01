import { BrokerClient, BrokerClientFactory, IBrokerClientOptions } from '@pequehq/smb-client';

import { BrokerProxy } from '../../models/interfaces/broker-proxy.interface';

export interface SmbPublishPayload {
  topic: string;
  data: string;
}

export interface SmbSubscribePayload {
  topic: string;
  data: string;
}

export class SmbBrokerClient extends BrokerProxy<unknown> {
  #client: BrokerClient;

  async connect(): Promise<void> {
    const calculateHostPort = (): IBrokerClientOptions => {
      const split = this.broker.split(':');
      return {
        host: split[0],
        port: !isNaN(Number(split[1])) ? Number(split[1]) : undefined,
      };
    };

    const smbFactory = new BrokerClientFactory();
    this.#client = smbFactory.createClient();
    await this.#client.connect(calculateHostPort());
  }

  publish(payload: SmbPublishPayload): void {
    this.#client.message(payload.topic, payload.data);
  }

  subscribe(cb: (event: SmbSubscribePayload) => void): void {
    this.#client.subscribe('.*', (command) => {
      cb({ topic: command.action.topic, data: command.action.message });
    });
  }
}
