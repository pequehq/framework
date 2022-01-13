import { CompleteTransportQueueItem, MicroserviceOptions } from '../../../models';
import { RedisBrokerClient } from '../../redis/redis-broker.client';
import { MicroserviceGatewayHandler } from './microservice-gateway-handler.abstract';

export class RedisGatewayService extends MicroserviceGatewayHandler {
  async publish(client: RedisBrokerClient, item: CompleteTransportQueueItem): Promise<void> {
    try {
      await client.publish({ channel: item.event, message: item.data });
      this.successPublish(item);
    } catch (error) {
      this.failedPublish(item);
    }
  }

  async subscribe(client: RedisBrokerClient): Promise<void> {
    await client.subscribe((event) => {
      this.pushEvent({ event: event.channel, transport: 'redis', data: event.message.toString() });
    });
  }

  async register(options: MicroserviceOptions): Promise<RedisBrokerClient> {
    const client = new RedisBrokerClient(options.broker);
    await client.connect();
    return client;
  }
}

export const RedisGateway = new RedisGatewayService();
