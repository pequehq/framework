export interface WebSocketDefinition<TOptions, TAdapter> {
  port: number;
  config: {
    options?: TOptions;
    adapter?: TAdapter;
  };
}
