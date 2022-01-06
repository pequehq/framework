import { ExternalTransportType } from './types';

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
