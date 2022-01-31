import { CompleteTransportQueueItem, MicroserviceOptions } from '../../../models';
import { KafkaBrokerClient } from '../../kafka/kafka-broker.client';
import { MicroserviceGatewayHandler } from './microservice-gateway-handler.abstract';

export class KafkaGatewayService extends MicroserviceGatewayHandler {
  async publish(client: KafkaBrokerClient, item: CompleteTransportQueueItem): Promise<void> {
    try {
      await client.publish({ topic: item.event, messages: [JSON.stringify(item.data)] });
      this.successPublish(item);
    } catch (error) {
      this.failedPublish(item);
    }
  }

  async register(options: MicroserviceOptions): Promise<KafkaBrokerClient> {
    const client = new KafkaBrokerClient(options.broker);
    await client.connect();
    return client;
  }

  async subscribe(client: KafkaBrokerClient): Promise<void> {
    await client.subscribe((event) => {
      if (event.message) {
        this.pushEvent({ event: event.topic, transport: 'kafka', data: event.message.toString() });
      }
    });
  }
}

export const KafkaGateway = new KafkaGatewayService();
