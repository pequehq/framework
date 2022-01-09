import { randomUUID } from 'crypto';
import { clearInterval } from 'timers';

import { CompleteTransportQueueItem, ExternalTransportType, TransportQueueItem } from '../../models';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/injector.service';
import { TransportSubjects } from '../subjects/subjects';

export class TransportQueueService {
  private enqueueInterval: any;
  private queues: Record<ExternalTransportType, Set<CompleteTransportQueueItem>> = {
    mqtt: new Set<CompleteTransportQueueItem>(),
    redis: new Set<CompleteTransportQueueItem>(),
  };

  private enqueueItems(): void {
    for (const queues of Object.values(this.queues)) {
      queues.forEach((item) => TransportSubjects.sendTransportSubject.next(item));
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

  private startRecycler(): void {
    if (!this.enqueueInterval) {
      this.enqueueInterval = setInterval(() => this.enqueueItems(), 2000);
    }
  }

  stopRecycler(): void {
    clearInterval(this.enqueueInterval);
  }

  init(): void {
    this.startRecycler();
    TransportSubjects.failedTransportSubject.subscribe((item) => {
      this.deleteItem(item);
      this.addItem(item);
    });
    TransportSubjects.successTransportSubject.subscribe((item) => this.deleteItem(item));
  }

  sendItem(item: TransportQueueItem): string {
    const id = randomUUID();
    TransportSubjects.sendTransportSubject.next({
      ...item,
      retry: 0,
      id,
    });
    return id;
  }

  clear(): void {
    for (const key of Object.keys(this.queues)) {
      this.queues[key].clear();
    }
  }
}

Injector.setNative('injectable', NATIVE_SERVICES.TRANSPORT_QUEUE, TransportQueueService);
export const TransportQueue = Injector.resolve<TransportQueueService>('injectable', NATIVE_SERVICES.TRANSPORT_QUEUE);
