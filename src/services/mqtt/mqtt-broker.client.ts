import mqtt from 'mqtt';

import { BrokerProxy } from '../../models/interfaces/broker-proxy.interface';

export interface MqttSubscribePayload {
  topic: string;
  payload: Buffer | string;
}

interface MqttPublishPayload {
  topic: string;
  payload: string;
}

export class MqttBrokerClient extends BrokerProxy<mqtt.IClientOptions> {
  private client: mqtt.MqttClient;

  async connect(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.client = mqtt.connect(this.broker, this.options);
      resolve();
    });
  }

  subscribe(cb: (event: MqttSubscribePayload) => void): void {
    this.client.subscribe('#', (err) => {
      if (err) {
        // @TODO manage: error on mqtt subscription.
        console.error('subs err', err);
      }
    });

    this.client.on('message', (topic, payload) => {
      cb({ topic, payload });
    });
  }

  async publish(payload: MqttPublishPayload): Promise<mqtt.Packet | undefined> {
    return new Promise((resolve, reject) => {
      this.client.publish(payload.topic, payload.payload, (error, packet) => {
        if (error) {
          reject(error);
        } else {
          resolve(packet);
        }
      });
    });
  }
}
