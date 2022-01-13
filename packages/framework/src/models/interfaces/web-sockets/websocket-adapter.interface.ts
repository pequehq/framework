export interface WebSocketAdapter<TServer = any, TOptions = any> {
  create(port: number, options?: TOptions): TServer;
  close(): void;
}
