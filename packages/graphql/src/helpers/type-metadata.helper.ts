import { Injectable } from '@pequehq/di';
import { GraphQLScalarType } from 'graphql';

import { IFieldOptionsMetadata, IReturnType, ITypeMetadata } from '../interfaces';

@Injectable()
export class TypeMetadataHelper {
  calculateMetadata(type: IReturnType): ITypeMetadata {
    return {
      type,
      absoluteType: Array.isArray(type) ? type[0] : type,
      scalar: type instanceof GraphQLScalarType,
      array: Array.isArray(type),
      primitive: typeof (type[0] ?? type) === 'string',
      object: typeof (type[0] ?? type) === 'function',
    };
  }

  toSDLType(metadata: IFieldOptionsMetadata): string {
    let result = `${metadata.type.absoluteType.toString()}!`;

    if (metadata.type.object) {
      result = `${metadata.type.absoluteType['name']}!`;
    }

    if (metadata.options?.nullable) {
      result = result.replace('!', '');
    }

    if (metadata.type.array) {
      result = `[${result}]!`;
      if (metadata.options?.nullableValues) {
        result = result.replace('!]', ']');
      }

      if (metadata.options?.nullable) {
        result = result.replace(']!', ']');
      }
    }

    return result;
  }
}
