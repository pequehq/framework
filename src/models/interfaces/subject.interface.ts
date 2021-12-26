import { NativeEventsType } from './types';

export interface SubjectEvent<TData> {
  event: NativeEventsType;
  data: TData;
}
