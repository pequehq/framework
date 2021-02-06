export interface WebSocketsClientManager {
  connect(uri: string, options?: any);
  emit(topic: string, value: any);
  on(topic: string, listener: (...args: any[]) => void);
}
