import { ExternalTransportType } from './types';

export interface MicroserviceOptions {
  transport: ExternalTransportType;
  broker: string;
}

export interface MicroserviceHandler {
  start();
}

export interface TransportQueueItem {
  transport: ExternalTransportType;
  destination: string;
  timestamp: number;
  event: string;
  data: unknown;
}

export interface CompleteTransportQueueItem extends TransportQueueItem {
  id: string;
  retry: number;
}
