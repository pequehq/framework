interface ProviderClass<T = any> extends Function {
  new (...args: any[]): T;
}

type ProviderInstance = InstanceType<ProviderClass>;

interface Dependency {
  provider: ProviderClass;
  identifier: string;
}

type DependencyMap = Map<ProviderClass, Dependency[]>;

export type { ProviderClass, ProviderInstance, DependencyMap, Dependency };
