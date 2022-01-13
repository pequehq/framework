import { Subject } from 'rxjs';

import { CompleteTransportQueueItem, SubjectType, TransportSubjectType } from '../../models';
import { SubjectEvent } from '../../models/interfaces/subject.interface';

export const Subjects: Record<SubjectType, Subject<SubjectEvent<unknown>>> = {
  lifeCycleSubject: new Subject<SubjectEvent<unknown>>(),
  pushEventSubject: new Subject<SubjectEvent<unknown>>(),
};

export const TransportSubjects: Record<TransportSubjectType, Subject<CompleteTransportQueueItem>> = {
  sendTransportSubject: new Subject<CompleteTransportQueueItem>(),
  failedTransportSubject: new Subject<CompleteTransportQueueItem>(),
  successTransportSubject: new Subject<CompleteTransportQueueItem>(),
};
