import { ReflectionHelper } from '../helpers/reflection.helper';
import { IFieldOptionsMetadata } from '../interfaces';

export const ObjectTypeFieldsMetadata = new ReflectionHelper<IFieldOptionsMetadata[]>('objectType:fields');
export const DesignTypeMetadata = new ReflectionHelper<any>('design:type');
