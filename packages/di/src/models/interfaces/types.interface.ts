import { IDependency } from './dependencies.interface';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type IContainers<T> = T | 'injectable';

export type ClassDeclaration = Type;

export type ProviderClass = ClassDeclaration;
export type ProviderInstance = InstanceType<ProviderClass>;

export type ProviderHookHandler = (name: string, instance: ProviderInstance) => void;

export type IDependencyMap = Map<ProviderClass, IDependency[]>;
