import { GraphQLScalarType } from 'graphql';

import { Type } from './types';

export type IPrimitiveTypes = 'Int' | 'Float' | 'String' | 'Boolean' | 'ID';
export type IReturnTypes = Type | GraphQLScalarType;
export type IReturnType = IPrimitiveTypes | [IPrimitiveTypes] | IReturnTypes | [IReturnTypes];
export type IAbsoluteReturnType = IPrimitiveTypes | IReturnTypes;
