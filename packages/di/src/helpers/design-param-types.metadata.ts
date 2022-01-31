import { ProviderClass } from '../types';
import { ReflectionMetadata } from './reflection';

class Implementation extends ReflectionMetadata<ProviderClass[]> {
  constructor() {
    super('design:paramtypes');
  }
}

export const DesignParamTypesMetadata = new Implementation();
