import { ObjectTypeFieldsMetadata } from '../constants/metadata.constants';
import { IFieldOptions, IFieldOptionsMetadata } from '../interfaces';

export function Field(options: IFieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const objectType = target.constructor;
    const fields: IFieldOptionsMetadata[] = ObjectTypeFieldsMetadata.get(objectType) ?? [];

    fields.push({ ...options, propertyKey });
    ObjectTypeFieldsMetadata.set(fields, objectType);
  };
}
