import { ResolverDeclaration } from '../../interfaces';

class ResolverStorageService {
  #resolvers = new Set<ResolverDeclaration>();

  getAll(): ResolverDeclaration[] {
    return [...this.#resolvers];
  }

  set(resolver: ResolverDeclaration): void {
    this.#resolvers.add(resolver);
  }

  clear(): void {
    this.#resolvers.clear();
  }
}

export const ResolverStorage = new ResolverStorageService();
