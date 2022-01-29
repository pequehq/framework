export abstract class ReflectionMetadata<TMetadata> {
  readonly #key: string | symbol;
  readonly #defaultValue: TMetadata | undefined;

  protected constructor(key: string | symbol, defaultValue?: TMetadata) {
    this.#key = key;
    this.#defaultValue = defaultValue;
  }

  get(target: object): TMetadata {
    return Reflect.getMetadata(this.#key, target) ?? this.#defaultValue;
  }

  set(metadata: TMetadata, target: object): void {
    Reflect.defineMetadata(this.#key, metadata, target);
  }
}
