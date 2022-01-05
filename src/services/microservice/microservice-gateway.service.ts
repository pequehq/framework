import * as mqtt from 'mqtt';
import { Subscription } from 'rxjs';

import { MicroserviceOptions } from '../../decorators';
import { CompleteTransportQueueItem, MicroserviceTransportType } from '../../models';
import { Subjects, TransportSubjects } from '../subjects/subjects';

class MicroserviceGatewayService {
  private subscriptions: Subscription[] = [];
  private gateways: Record<MicroserviceTransportType, Map<string, any>> = {
    mqtt: new Map<string, mqtt.MqttClient>(),
  };

  private register: Record<MicroserviceTransportType, (options: MicroserviceOptions) => void> = {
    mqtt: (options) => {
      this.gateways.mqtt.set(options.broker, mqtt.connect(options.broker));
      this.gateways.mqtt.get(options.broker).on('message', (topic, payload) => {
        console.log('in mqtt', payload.toString());
        Subjects.pushEventSubject.next({ event: `ms.${topic}`, data: JSON.parse(payload.toString()) });
      });
    },
  };

  private publish: Record<MicroserviceTransportType, (item: CompleteTransportQueueItem) => void> = {
    mqtt: (item) => {
      console.log('mqtt', item);
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
  };

  startListening() {
    this.subscriptions.push(
      TransportSubjects.sendTransportSubject.subscribe((item) => {
        console.log('in subj', item);
        this.publish[item.transport](item);
      }),
    );
  }

  registerGateway(options: MicroserviceOptions): void {
    this.register[options.transport](options);
  }
}

export const Gateways = new MicroserviceGatewayService();
