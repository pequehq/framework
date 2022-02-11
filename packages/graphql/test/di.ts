import { Container } from '@pequehq/di';

import { GraphQL, ResolverService } from '../src';
import { diHelper } from '../src/helpers';

export const DI = new Container();

export function loadProviders(): void {
  DI.set(ResolverService, ResolverService.name);
  DI.set(GraphQL, GraphQL.name);

  diHelper.register(DI);
}

export function unloadProviders(): void {
  diHelper.get().unsetAll();
}
