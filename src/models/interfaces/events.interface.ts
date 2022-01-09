import { NativeEventsType, TransportType } from './types';

export interface Event {
  event: string | NativeEventsType;
  transport: TransportType;
}

export interface OnEventInterface {
  event: Event;
  listener: (...args: unknown[]) => unknown;
}

export interface EventPayload<TData> {
  event: string | NativeEventsType;
  timestamp: number;
  data: TData;
}
