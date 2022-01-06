import * as mqtt from 'mqtt';
import * as redis from 'redis';
import { Subscription } from 'rxjs';

import { MicroserviceOptions } from '../../decorators';
import { CompleteTransportQueueItem, TransportType } from '../../models';
import { Redis } from '../redis/redis.service';
import { Subjects, TransportSubjects } from '../subjects/subjects';

class MicroserviceGatewayService {
  private subscriptions: Subscription[] = [];
  private gateways: Record<TransportType, Map<string, any>> = {
    mqtt: new Map<string, mqtt.MqttClient>(),
    redis: new Map<string, redis.RedisClientType>(),
    internal: new Map<string, string>(),
  };

  private register: Record<TransportType, (options: MicroserviceOptions) => void> = {
    mqtt: (options) => {
      this.gateways.mqtt.set(options.broker, mqtt.connect(options.broker));
      const client: mqtt.MqttClient = this.gateways.mqtt.get(options.broker);
      client.on('connect', (packet) => {
        client.subscribe('#', (err) => {
          if (err) {
            // @TODO manage: error on mqtt subscription.
            console.error('subs err', err);
          }
        });
      });
      client.on('message', (topic, payload) => {
        Subjects.pushEventSubject.next({
          event: { event: topic, transport: 'mqtt' },
          data: JSON.parse(payload.toString()),
        });
      });
    },
    redis: async (options) => {
      this.gateways.redis.set(options.broker, {
        subscriber: await Redis.createClient({ url: options.broker }),
        publisher: await Redis.createClient({ url: options.broker }),
      });
      const client: { subscriber: redis.RedisClientType; publisher: redis.RedisClientType } = this.gateways.redis.get(
        options.broker,
      );
    },
    internal: () => undefined,
  };

  private publish: Record<TransportType, (item: CompleteTransportQueueItem) => void> = {
    mqtt: (item) => {
      const gateway: mqtt.MqttClient = this.gateways.mqtt.get(item.destination);
      gateway.publish(item.event, JSON.stringify(item.data), (error) => {
        if (error) {
          item.retry++;
          TransportSubjects.failedTransportSubject.next(item);
        } else {
          TransportSubjects.successTransportSubject.next(item);
        }
      });
    },
    redis: (item) => item.transport,
    internal: (item) => item.transport,
  };

  startListening(): void {
    this.subscriptions.push(
      TransportSubjects.sendTransportSubject.subscribe((item) => {
        this.publish[item.transport](item);
      }),
    );
  }

  registerGateway(options: MicroserviceOptions): void {
    this.register[options.transport](options);
  }
}

export const Gateways = new MicroserviceGatewayService();
