import { Subject } from 'rxjs';

import { NativeEventsType } from '../../models';

export interface LifeCycleEvent<TData> {
  event: NativeEventsType;
  data: TData;
}

export const LifeCycleEventEmitter = new Subject<LifeCycleEvent<unknown>>();
