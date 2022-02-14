import { ResolverDeclaration } from '../interfaces';
import { ResolverStorage } from '../services';

export function Resolver(): ClassDecorator {
  return (target) => {
    ResolverStorage.set(target as unknown as ResolverDeclaration);
  };
}
