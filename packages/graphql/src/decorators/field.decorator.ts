import 'reflect-metadata';

import { ObjectTypeFieldsMetadata } from '../constants/metadata.constants';
import { DI } from '../di';
import { TypeMetadataHelper } from '../helpers';
import { IFieldOptions, IFieldOptionsMetadata, IReturnType } from '../interfaces';

export function Field(type: IReturnType, options?: IFieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const objectType = target.constructor;
    const fields: IFieldOptionsMetadata[] = ObjectTypeFieldsMetadata.get(objectType) ?? [];
    const typeMetadataHelper = DI.get<TypeMetadataHelper>(TypeMetadataHelper.name);

    fields.push({ propertyKey, type: typeMetadataHelper.calculateMetadata(type), options });
    ObjectTypeFieldsMetadata.set(fields, objectType);
  };
}
