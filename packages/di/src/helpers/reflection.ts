export abstract class ReflectionMetadata<TMetadata> {
  readonly #key: string | symbol;

  protected constructor(key: string | symbol) {
    this.#key = key;
  }

  get(target: object): TMetadata {
    return Reflect.getMetadata(this.#key, target);
  }

  set(metadata: TMetadata, target: object): void {
    Reflect.defineMetadata(this.#key, metadata, target);
  }
}
