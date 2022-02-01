export class BrokerAddressInvalidError extends Error {
  constructor(address: string) {
    super(`Broker address invalid: ${address}`);
  }
}
