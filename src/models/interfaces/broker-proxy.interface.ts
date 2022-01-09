export abstract class BrokerProxy<TOptions = any> {
  constructor(protected broker: string, protected options?: TOptions) {}

  abstract connect();
  abstract subscribe(cb: (event: unknown) => void);
  abstract publish(payload: unknown): unknown;
}
