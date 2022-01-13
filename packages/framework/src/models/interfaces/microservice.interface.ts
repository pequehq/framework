import { ExternalTransportType } from './types';

export interface MicroserviceOptions {
  transport: ExternalTransportType;
  broker: string;
}

export interface BrokerQueueItem {
  transport: ExternalTransportType;
  broker: string;
}

export interface OptionalBrokerQueueItem {
  transport?: ExternalTransportType;
  broker?: string;
}

export interface QueueItem {
  timestamp: number;
  event: string;
  data: unknown;
}

export interface OptionalTransportQueueItem extends QueueItem, OptionalBrokerQueueItem {}
export interface TransportQueueItem extends QueueItem, BrokerQueueItem {}

export interface CompleteTransportQueueItem extends TransportQueueItem {
  id: string;
  retry: number;
}
