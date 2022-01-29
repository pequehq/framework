export class ProviderNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Provider [${identifier}] not found.`);
  }
}
