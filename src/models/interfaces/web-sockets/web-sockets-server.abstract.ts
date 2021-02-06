import * as http from 'http';

export interface WebSocketsServerManager {
  create(sever: http.Server, options?: any);
  emit(topic: string, value: any);
  on(topic: string, listener: (...args: any[]) => void);
}
