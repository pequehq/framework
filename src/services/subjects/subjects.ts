import { Subject } from 'rxjs';

import { SubjectType } from '../../models';
import { SubjectEvent } from '../../models/interfaces/subject.interface';

export const Subjects: Record<SubjectType, Subject<SubjectEvent<unknown>>> = {
  lifeCycleSubject: new Subject<SubjectEvent<unknown>>(),
  pushEventSubject: new Subject<SubjectEvent<unknown>>(),
};
