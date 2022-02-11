import { RESOLVERS } from '../constants/graphql.constants';
import { Resolver } from '../interfaces';

export function Resolver(): ClassDecorator {
  return (target) => {
    RESOLVERS.push(target as unknown as Resolver);
  };
}
