export interface HandlerBeforeOptions {
  override?: boolean;
}

export interface HandlerAfterOptions<TResult> {
  handlerResult?: TResult
}
