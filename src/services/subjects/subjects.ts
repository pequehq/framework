import { Subject } from 'rxjs';
import { SubjectEvent } from '../../models/interfaces/subject.interface';
import { SubjectType } from '../../models';

export const Subjects: Record<SubjectType, Subject<SubjectEvent<unknown>>> = {
  lifeCycleSubject: new Subject<SubjectEvent<unknown>>()
}
