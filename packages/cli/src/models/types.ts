export interface Type<T = unknown> extends Function {
  new (...args: unknown[]): T;
}

export type ClassDeclaration = Type;

export type CommandClass = ClassDeclaration;
export type CommandInstance = InstanceType<CommandClass>;
