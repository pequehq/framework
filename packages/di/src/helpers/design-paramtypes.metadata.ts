import { ProviderClass } from '../types';
import { ReflectionMetadata } from './reflection';

class DesignParamTypesMetadata extends ReflectionMetadata<ProviderClass[]> {
  constructor() {
    super('design:paramtypes', []);
  }
}

export const designParamTypesMetadata = new DesignParamTypesMetadata();
