import { CompleteTransportQueueItem, MicroserviceOptions } from '../../../models';
import { MqttBrokerClient } from '../../mqtt/mqtt-broker.client';
import { MicroserviceGatewayHandler } from './microservice-gateway-handler.abstract';

export class MqttGatewayService extends MicroserviceGatewayHandler {
  async publish(client: MqttBrokerClient, item: CompleteTransportQueueItem): Promise<void> {
    try {
      await client.publish({ topic: item.event, payload: JSON.stringify(item.data) });
      this.successPublish(item);
    } catch (error) {
      this.failedPublish(item);
    }
  }

  subscribe(client: MqttBrokerClient): void {
    client.subscribe((event) => {
      this.pushEvent({ event: event.topic, transport: 'mqtt', data: event.payload.toString() });
    });
  }

  async register(options: MicroserviceOptions): Promise<MqttBrokerClient> {
    const client = new MqttBrokerClient(options.broker);
    await client.connect();
    return client;
  }
}

export const MqttGateway = new MqttGatewayService();
