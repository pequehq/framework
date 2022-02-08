import { IReturnTypeFunction } from './return-type.interface';

export interface IFieldOptions {
  nullable?: boolean;
}

export interface IFieldOptionsMetadata extends IFieldOptions {
  propertyKey: string | symbol;
  type: IReturnTypeFunction | string;
  options?: IFieldOptions;
}
