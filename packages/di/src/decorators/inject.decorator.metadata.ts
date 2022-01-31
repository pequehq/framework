import { ReflectionMetadata } from '../helpers/reflection';
import { InjectMetadata, InjectMetadataParam, InjectMetadataProperty } from './inject.decorator.types';

class Implementation extends ReflectionMetadata<InjectMetadata[]> {
  constructor() {
    super(Symbol('inject'));
  }

  getPropertiesOnly(target: object): InjectMetadataProperty[] {
    return (this.get(target) ?? []).filter((data) => !data.parameterIndex) as InjectMetadataProperty[];
  }

  getParamsOnly(target: object): InjectMetadataParam[] {
    return (this.get(target) ?? []).filter((data) => !data.propertyKey) as InjectMetadataParam[];
  }
}

export const InjectDecoratorMetadata = new Implementation();
