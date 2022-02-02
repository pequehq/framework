import { BrokerClient, BrokerClientFactory, IBrokerClientOptions } from '@pequehq/smb-client';

import { BrokerAddressInvalidError } from '../../models';
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
      const [host, port] = this.broker.split(':');

      if (!port || isNaN(Number(port))) {
        throw new BrokerAddressInvalidError(this.broker);
      }

      return {
        host,
        port: Number(port),
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
