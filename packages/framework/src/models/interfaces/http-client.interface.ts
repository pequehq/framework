export interface HttpClient<TOptions = any> {
  request(options: TOptions): Promise<unknown> | unknown;
}
