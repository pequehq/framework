import 'reflect-metadata';

export class ReflectionHelper<TMetadata> {
  constructor(private key: string | symbol) {}

  get(target: object): TMetadata {
    return Reflect.getMetadata(this.key, target);
  }

  set(metadata: TMetadata, target: object): void {
    Reflect.defineMetadata(this.key, metadata, target);
  }

  exists(target: object): boolean {
    return !!Reflect.getMetadata(this.key, target);
  }
}
