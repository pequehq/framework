import { NativeEventsType } from './types';

export interface SubjectEvent<TData> {
  event: string | NativeEventsType;
  data: TData;
}
