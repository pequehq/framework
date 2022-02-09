import { ReflectionHelper } from '../helpers';
import { IFieldOptionsMetadata } from '../interfaces';

export const ObjectTypeFieldsMetadata = new ReflectionHelper<IFieldOptionsMetadata[]>('objectType:fields');
export const ResolverQueriesMetadata = new ReflectionHelper<IFieldOptionsMetadata[]>('resolver:queries');
export const ResolverMutationsMetadata = new ReflectionHelper<IFieldOptionsMetadata[]>('resolver:mutations');
export const ResolverSubscriptionsMetadata = new ReflectionHelper<IFieldOptionsMetadata[]>('resolver:subscriptions');
export const DesignTypeMetadata = new ReflectionHelper<any>('design:type');
