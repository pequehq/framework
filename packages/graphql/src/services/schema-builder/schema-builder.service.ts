import { Injectable } from '@pequehq/di';

import { OBJECT_TYPES } from '../../constants/graphql.constants';
import { ObjectTypeFieldsMetadata } from '../../constants/metadata.constants';
import { MustacheHelper, TypeMetadataHelper } from '../../helpers';

interface FieldView {
  name: string;
  type: string;
}
interface TypeView {
  objectType: string;
  fields: FieldView[];
}

@Injectable()
export class SchemaBuilderService {
  constructor(private typeMetadataHelper: TypeMetadataHelper) {}

  generateTypes(): string {
    const schema: string[] = [];
    const mustacheHelper = new MustacheHelper('object-type.mustache');
    for (const objectType of OBJECT_TYPES) {
      const view: TypeView = {
        objectType: objectType.name,
        fields: [],
      };

      const fieldsMetadata = ObjectTypeFieldsMetadata.get(objectType);
      for (const fieldMetadata of fieldsMetadata) {
        const sdlType = this.typeMetadataHelper.toSDLType(fieldMetadata);
        view.fields.push({ name: fieldMetadata.propertyKey.toString(), type: sdlType });
      }

      schema.push(mustacheHelper.render(view));
    }

    return schema.join('\n');
  }
}
