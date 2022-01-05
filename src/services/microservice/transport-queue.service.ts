import { CompleteTransportQueueItem, MicroserviceTransportType, TransportQueueItem } from '../../models';
import { TransportSubjects } from '../subjects/subjects';

class TransportQueueService {
  private enqueueInterval: NodeJS.Timer;
  private queues: Record<MicroserviceTransportType, Set<CompleteTransportQueueItem>> = {
    mqtt: new Set<CompleteTransportQueueItem>(),
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
    console.log('send', item);
    TransportSubjects.sendTransportSubject.next({
      event: item.event,
      transport: item.transport,
      retry: 0,
      data: item.data,
      id: 'zz',
      timestamp: item.timestamp,
      destination: item.destination,
    });
  }
}

export const TransportQueue = new TransportQueueService();
