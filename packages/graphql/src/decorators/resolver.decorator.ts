import { RESOLVERS } from '../constants/graphql.constants';
import { ResolverDeclaration } from '../interfaces';

export function Resolver(): ClassDecorator {
  return (target) => {
    RESOLVERS.push(target as unknown as ResolverDeclaration);
  };
}
