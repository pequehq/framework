import { CompleteTransportQueueItem, MicroserviceOptions } from '../../../models';
import { SmbBrokerClient } from '../../smb/smb-broker.client';
import { MicroserviceGatewayHandler } from './microservice-gateway-handler.abstract';

export class SmbGatewayService extends MicroserviceGatewayHandler {
  publish(client: SmbBrokerClient, item: CompleteTransportQueueItem): void {
    try {
      client.publish({ topic: item.event, data: JSON.stringify(item.data) });
      this.successPublish(item);
    } catch (error) {
      this.failedPublish(item);
    }
  }

  async register(options: MicroserviceOptions): Promise<SmbBrokerClient> {
    const client = new SmbBrokerClient(options.broker);
    await client.connect();
    return client;
  }

  subscribe(client: SmbBrokerClient): void {
    client.subscribe((event) => {
      this.pushEvent({ event: event.topic, transport: 'kafka', data: event.data.toString() });
    });
  }
}

export const SmbGateway = new SmbGatewayService();
