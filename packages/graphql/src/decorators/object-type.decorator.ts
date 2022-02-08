import { OBJECT_TYPES } from '../constants/graphql.constants';
import { ObjectTypeFieldsMetadata } from '../constants/metadata.constants';
import { ClassDeclaration, IFieldOptionsMetadata } from '../interfaces';

export function ObjectType(): ClassDecorator {
  return (target) => {
    OBJECT_TYPES.push(target as unknown as ClassDeclaration);

    const fields: IFieldOptionsMetadata[] = [];
    if (!ObjectTypeFieldsMetadata.exists(target)) {
      ObjectTypeFieldsMetadata.set(fields, target);
    }
  };
}
