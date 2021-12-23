import { NativeEventsType } from '../../models';
import { Subject } from 'rxjs';

export interface LifeCycleEvent<TData> {
  event: NativeEventsType;
  data: TData;
}

export const LifeCycleEventEmitter = new Subject<LifeCycleEvent<unknown>>();
