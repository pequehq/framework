export interface IInjectableOptions {
  to: string;
}

export interface IInjectOptions {
  identifier: string;
}

export interface IProviderInject {
  identifier: string;
  propertyKey?: string;
  parameterIndex?: number;
}
