import { IReturnTypeFunction } from './return-type.interface';

export interface IFieldOptions {
  type: IReturnTypeFunction;
  nullable: boolean;
}

export interface IFieldOptionsMetadata extends IFieldOptions {
  propertyKey: string | symbol;
}
