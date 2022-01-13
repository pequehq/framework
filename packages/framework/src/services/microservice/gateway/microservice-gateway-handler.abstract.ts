import { CompleteTransportQueueItem, ExternalTransportType, MicroserviceOptions } from '../../../models';
import { Subjects, TransportSubjects } from '../../subjects/subjects';

export interface PushGatewayEvent {
  event: string;
  transport: ExternalTransportType;
  data: string;
}

export abstract class MicroserviceGatewayHandler {
  abstract register(options: MicroserviceOptions): unknown;
  abstract subscribe(client: unknown): void;
  abstract publish(client: unknown, item: CompleteTransportQueueItem): void;

  successPublish(item: CompleteTransportQueueItem): void {
    TransportSubjects.successTransportSubject.next(item);
  }

  failedPublish(item: CompleteTransportQueueItem): void {
    item.retry++;
    TransportSubjects.failedTransportSubject.next(item);
  }

  pushEvent(event: PushGatewayEvent): void {
    Subjects.pushEventSubject.next({
      event: { event: event.event, transport: event.transport },
      data: JSON.parse(event.data),
    });
  }
}
