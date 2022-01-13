import { Event } from './events.interface';

export interface SubjectEvent<TData> {
  event: Event;
  data: TData;
}
