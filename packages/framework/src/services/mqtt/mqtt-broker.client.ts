import { IClientOptions, MqttClient, Packet } from 'mqtt';

import { BrokerProxy } from '../../models/interfaces/broker-proxy.interface';
import { mqttConnect } from './mqtt.connect';

export interface MqttSubscribePayload {
  topic: string;
  payload: Buffer | string;
}

export interface MqttPublishPayload {
  topic: string;
  payload: string;
}

export class MqttBrokerClient extends BrokerProxy<IClientOptions> {
  #client: MqttClient;

  async connect(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.#client = mqttConnect.connect(this.broker, this.options);
      this.#client.on('connect', (packet) => {
        resolve();
      });
    });
  }

  subscribe(cb: (event: MqttSubscribePayload) => void): void {
    this.#client.subscribe('#', (err) => {
      if (err) {
        // @TODO manage: error on mqtt subscription.
      }
    });

    this.#client.on('message', (topic, payload) => {
      cb({ topic, payload });
    });
  }

  async publish(payload: MqttPublishPayload): Promise<Packet | undefined> {
    return new Promise((resolve, reject) => {
      this.#client.publish(payload.topic, payload.payload, (error, packet) => {
        if (error) {
          reject(error);
        } else {
          resolve(packet);
        }
      });
    });
  }
}
