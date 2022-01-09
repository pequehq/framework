import redis, { createClient } from 'redis';

import { BrokerProxy } from '../../models/interfaces/broker-proxy.interface';

interface RedisClients {
  subscriber: redis.RedisClientType<any>;
  publisher: redis.RedisClientType<any>;
}

interface RedisPublishPayload {
  channel: string;
  message: unknown;
}

export interface RedisSubscribePayload {
  channel: string;
  message: string;
}

export class RedisBrokerClient extends BrokerProxy<unknown> {
  private client: RedisClients;

  async connect(): Promise<void> {
    return new Promise(async (resolve) => {
      const subscriber = createClient({ url: this.broker });
      const publisher = createClient({ url: this.broker });
      await Promise.all([subscriber.connect(), publisher.connect()]);
      this.client = { subscriber, publisher };
      resolve();
    });
  }

  publish(payload: RedisPublishPayload): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.client.publisher.publish(payload.channel, JSON.stringify(payload.message));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async subscribe(cb: (event: RedisSubscribePayload) => void): Promise<void> {
    await this.client.subscriber.pSubscribe('*', (message, channel) => {
      cb({ channel, message });
    });
  }
}
