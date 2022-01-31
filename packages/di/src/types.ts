interface ProviderClass<T = any> extends Function {
  new (...args: any[]): T;
}

export type { ProviderClass };
