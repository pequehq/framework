export interface TransformerHandler {
  transform(value: unknown): unknown | Promise<unknown>;
}
