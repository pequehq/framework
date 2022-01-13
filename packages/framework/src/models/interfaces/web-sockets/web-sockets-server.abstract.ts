import { Server } from 'http';

export interface WebSocketsServerManager {
  create(sever: Server, options?: any);
  emit(topic: string, value: any);
  on(topic: string, listener: (...args: any[]) => void);
}
