import { randomUUID } from 'crypto';
import { clearInterval } from 'timers';

import { CompleteTransportQueueItem, ExternalTransportType, TransportQueueItem } from '../../models';
import { NATIVE_SERVICES } from '../../models/constants/native-services';
import { Injector } from '../../models/dependency-injection/dependency-injection.service';
import { TransportSubjects } from '../subjects/subjects';

export class TransportQueueService {
  readonly intervalMilliseconds = 2000;

  #enqueueInterval: NodeJS.Timer;
  #queues: Record<ExternalTransportType, Set<CompleteTransportQueueItem>> = {
    mqtt: new Set<CompleteTransportQueueItem>(),
    redis: new Set<CompleteTransportQueueItem>(),
    kafka: new Set<CompleteTransportQueueItem>(),
    smb: new Set<CompleteTransportQueueItem>(),
  };

  #enqueueItems(): void {
    for (const queues of Object.values(this.#queues)) {
      for (const item of queues) {
        TransportSubjects.sendTransportSubject.next(item);
      }
    }
  }

  #sortQueues(): void {
    for (const key of Object.keys(this.#queues)) {
      this.#queues[key] = new Set([...this.#queues[key]].sort((a, b) => a.timestamp - b.timestamp));
    }
  }

  #addItem(item: CompleteTransportQueueItem): void {
    this.#queues[item.transport].add(item);
    this.#sortQueues();
  }

  #deleteItem(item: CompleteTransportQueueItem): void {
    this.#queues[item.transport].delete(item);
  }

  #startRecycler(): void {
    if (!this.#enqueueInterval) {
      this.#enqueueInterval = setInterval(() => this.#enqueueItems(), this.intervalMilliseconds);
    }
  }

  stopRecycler(): void {
    clearInterval(this.#enqueueInterval);
  }

  init(): void {
    this.#startRecycler();
    TransportSubjects.failedTransportSubject.subscribe((item) => {
      this.#deleteItem(item);
      this.#addItem(item);
    });
    TransportSubjects.successTransportSubject.subscribe((item) => this.#deleteItem(item));
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
    for (const key of Object.keys(this.#queues)) {
      this.#queues[key].clear();
    }
  }
}

// @TODO remove to avoid side-effects on module import
Injector.setNative('injectable', NATIVE_SERVICES.TRANSPORT_QUEUE, TransportQueueService);

export const TransportQueue = Injector.resolve<TransportQueueService>('injectable', NATIVE_SERVICES.TRANSPORT_QUEUE);
