import { IAbsoluteReturnType, IPrimitiveTypes, IReturnType } from './return-type.interface';

export interface IFieldOptions {
  nullable?: boolean;
  nullableValues?: boolean;
}

export interface ITypeMetadata {
  type: IReturnType | IPrimitiveTypes;
  absoluteType: IAbsoluteReturnType;
  array: boolean;
  primitive: boolean;
  scalar: boolean;
  object: boolean;
}

export interface IFieldOptionsMetadata extends IFieldOptions {
  propertyKey: string | symbol;
  type: ITypeMetadata;
  options?: IFieldOptions;
}
