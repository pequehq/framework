import { GraphQLScalarType } from 'graphql';

import { Type } from './types';

export type IReturnTypes = Type | GraphQLScalarType;
export type IReturnTypeFunction = (type: void) => IReturnTypes;
