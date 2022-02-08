export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type ClassDeclaration = Type;

export type ObjectType = ClassDeclaration;
