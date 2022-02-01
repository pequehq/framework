import { Subscription } from 'rxjs';

import { CompleteTransportQueueItem, ExternalTransportType, MicroserviceOptions } from '../../models';
import { KafkaBrokerClient } from '../kafka/kafka-broker.client';
import { MqttBrokerClient } from '../mqtt/mqtt-broker.client';
import { RedisBrokerClient } from '../redis/redis-broker.client';
import { SmbBrokerClient } from '../smb/smb-broker.client';
import { TransportSubjects } from '../subjects/subjects';
import { KafkaGateway } from './gateway/kafka-gateway.service';
import { MqttGateway } from './gateway/mqtt-gateway.service';
import { RedisGateway } from './gateway/redis-gateway.service';
import { SmbGateway } from './gateway/smb-gateway.service';

class MicroserviceGatewayService {
  #subscriptions: Subscription[] = [];
  #gateways: Record<ExternalTransportType, Map<string, any>> = {
    mqtt: new Map<string, MqttBrokerClient>(),
    redis: new Map<string, RedisBrokerClient>(),
    kafka: new Map<string, KafkaBrokerClient>(),
    smb: new Map<string, SmbBrokerClient>(),
  };

  #register: Record<ExternalTransportType, (options: MicroserviceOptions) => void> = {
    mqtt: async (options) => {
      const client = await MqttGateway.register(options);
      MqttGateway.subscribe(client);
      this.#gateways.mqtt.set(options.broker, client);
    },
    redis: async (options) => {
      const client = await RedisGateway.register(options);
      await RedisGateway.subscribe(client);
      this.#gateways.redis.set(options.broker, client);
    },
    kafka: async (options) => {
      const client = await KafkaGateway.register(options);
      await KafkaGateway.subscribe(client);
      this.#gateways.kafka.set(options.broker, client);
    },
    smb: async (options) => {
      const client = await SmbGateway.register(options);
      SmbGateway.subscribe(client);
      this.#gateways.smb.set(options.broker, client);
    },
  };

  #publish: Record<ExternalTransportType, (item: CompleteTransportQueueItem) => void> = {
    mqtt: async (item) => {
      await MqttGateway.publish(this.#gateways.mqtt.get(item.broker), item);
    },
    redis: async (item) => {
      await RedisGateway.publish(this.#gateways.redis.get(item.broker), item);
    },
    kafka: async (item) => {
      await KafkaGateway.publish(this.#gateways.kafka.get(item.broker), item);
    },
    smb: (item) => {
      SmbGateway.publish(this.#gateways.mqtt.get(item.broker), item);
    },
  };

  startListening(): void {
    this.#subscriptions.push(
      TransportSubjects.sendTransportSubject.subscribe((item) => {
        this.#publish[item.transport](item);
      }),
    );
  }

  registerGateway(options: MicroserviceOptions): void {
    this.#register[options.transport](options);
  }

  stopListening(): void {
    for (const subscription of this.#subscriptions) {
      subscription.unsubscribe();
    }
    for (const key of Object.keys(this.#gateways)) {
      this.#gateways[key].clear();
    }
  }
}

export const Gateways = new MicroserviceGatewayService();
