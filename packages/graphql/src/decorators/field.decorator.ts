import 'reflect-metadata';

import { DesignTypeMetadata, ObjectTypeFieldsMetadata } from '../constants/metadata.constants';
import { IFieldOptions, IFieldOptionsMetadata, IReturnTypeFunction } from '../interfaces';

export function Field(type?: IReturnTypeFunction, options?: IFieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const objectType = target.constructor;
    const typeMeta = DesignTypeMetadata.get(objectType);
    console.log(propertyKey, typeMeta);
    const fields: IFieldOptionsMetadata[] = ObjectTypeFieldsMetadata.get(objectType) ?? [];

    fields.push({ propertyKey, type: type ? type : typeMeta, options });
    ObjectTypeFieldsMetadata.set(fields, objectType);
  };
}
