import { randomUUID } from 'crypto';

import { CompleteTransportQueueItem, ExternalTransportType, TransportQueueItem } from '../../models';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/injector.service';
import { TransportSubjects } from '../subjects/subjects';

export class TransportQueueService {
  private enqueueInterval: NodeJS.Timer;
  private queues: Record<ExternalTransportType, Set<CompleteTransportQueueItem>> = {
    mqtt: new Set<CompleteTransportQueueItem>(),
    redis: new Set<CompleteTransportQueueItem>(),
  };

  constructor() {
    this.enqueueInterval = setInterval(() => this.enqueueItems(), 5000);
    TransportSubjects.failedTransportSubject.subscribe((item) => {
      this.deleteItem(item);
      this.addItem(item);
    });
    TransportSubjects.successTransportSubject.subscribe((item) => this.deleteItem(item));
  }

  private enqueueItems(): void {
    for (const key of Object.keys(this.queues)) {
      [...this.queues[key]].forEach((item) => TransportSubjects.sendTransportSubject.next(item));
    }
  }

  private sortQueues(): void {
    for (const key of Object.keys(this.queues)) {
      this.queues[key] = new Set([...this.queues[key]].sort((a, b) => a.timestamp - b.timestamp));
    }
  }

  private addItem(item: CompleteTransportQueueItem): void {
    this.queues[item.transport].add(item);
    this.sortQueues();
  }

  private deleteItem(item: CompleteTransportQueueItem): void {
    this.queues[item.transport].delete(item);
  }

  sendItem(item: TransportQueueItem): void {
    TransportSubjects.sendTransportSubject.next({
      ...item,
      retry: 0,
      id: randomUUID(),
    });
  }
}

Injector.setNative('injectable', NATIVE_SERVICES.TRANSPORT_QUEUE, TransportQueueService);
export const TransportQueue = Injector.resolve<TransportQueueService>('injectable', NATIVE_SERVICES.TRANSPORT_QUEUE);
